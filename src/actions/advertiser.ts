"use server";

import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "bookmyadspace_super_secret_key");

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const p = Math.PI / 180;
  const a = 0.5 - Math.cos((lat2 - lat1) * p)/2 + 
            Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p))/2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function getAdvertiserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    return verified.payload.id as number;
  } catch {
    return null;
  }
}

export async function getAISuggestions(lat: number, lng: number, excludeId: number) {
  try {
    const query = `
      SELECT *, 
      ( 6371 * acos( cos( radians(?) ) * cos( radians( SUBSTRING_INDEX(gps_coordinates, ',', 1) ) ) * cos( radians( SUBSTRING_INDEX(gps_coordinates, ',', -1) ) - radians(?) ) + sin( radians(?) ) * sin( radians( SUBSTRING_INDEX(gps_coordinates, ',', 1) ) ) ) ) AS distance_km 
      FROM hoardings 
      WHERE admin_status = 'Approved' 
      AND id != ?
      AND gps_coordinates IS NOT NULL
      HAVING distance_km <= 2
      ORDER BY distance_km ASC
      LIMIT 5
    `;
    const [rows] = await pool.execute(query, [lat, lng, lat, excludeId]) as [unknown[], unknown];
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function addToCart(hoardingId: number) {
  try {
    const advertiserId = await getAdvertiserId();
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    const [existing] = await pool.execute(
      "SELECT id FROM cart_items WHERE advertiser_id = ? AND hoarding_id = ?",
      [advertiserId, hoardingId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return { success: false, error: "Hoarding is already in your cart." };
    }

    await pool.execute(
      "INSERT INTO cart_items (advertiser_id, hoarding_id) VALUES (?, ?)",
      [advertiserId, hoardingId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function getCart() {
  try {
    const advertiserId = await getAdvertiserId();
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT c.id as cart_item_id, h.id as hoarding_id, h.hoarding_id_string, h.location, h.size, h.media_type, h.base_price
       FROM cart_items c
       JOIN hoardings h ON c.hoarding_id = h.id
       WHERE c.advertiser_id = ?`,
      [advertiserId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch cart" };
  }
}

export async function removeFromCart(cartItemId: number) {
  try {
    const advertiserId = await getAdvertiserId();
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    await pool.execute(
      "DELETE FROM cart_items WHERE id = ? AND advertiser_id = ?",
      [cartItemId, advertiserId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to remove item" };
  }
}

export async function checkoutCart(formData: FormData) {
  try {
    const advertiserId = await getAdvertiserId();
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    const campaignName = formData.get("campaignName") as string;
    const advertiserName = formData.get("advertiserName") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const artworkFile = formData.get("artwork") as File;

    if (!artworkFile || artworkFile.size === 0) {
      return { success: false, error: "Artwork upload is mandatory." };
    }

    const [cartRows] = await pool.execute(
      `SELECT c.hoarding_id, h.media_owner_id, h.base_price 
       FROM cart_items c
       JOIN hoardings h ON c.hoarding_id = h.id
       WHERE c.advertiser_id = ?`,
      [advertiserId]
    );

    interface CartItem {
      hoarding_id: number;
      media_owner_id: number;
      base_price: number;
    }

    const cartItems = cartRows as CartItem[];
    if (cartItems.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/creatives");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await artworkFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanFileName = artworkFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `art_${Date.now()}_${cleanFileName}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const artworkUrl = `/uploads/creatives/${fileName}`;

    const transactionId = `TXN${Date.now()}`;
    
    for (const item of cartItems) {
      const amountWithTax = Number(item.base_price) * 1.18;

      const [bookingResult] = await pool.execute(
        `INSERT INTO bookings 
        (advertiser_id, hoarding_id, advertiser_name, campaign_name, start_date, end_date, total_amount, status, artwork_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
        [advertiserId, item.hoarding_id, advertiserName, campaignName, startDate, endDate, amountWithTax, artworkUrl]
      );

      const bookingId = (bookingResult as { insertId: number }).insertId;

      await pool.execute(
        `INSERT INTO payments 
        (booking_id, media_owner_id, amount, paid_amount, due_date, payment_date, status, payment_method, transaction_id) 
        VALUES (?, ?, ?, ?, ?, CURRENT_DATE, 'Paid', 'Online Gateway', ?)`,
        [bookingId, item.media_owner_id, amountWithTax, amountWithTax, startDate, transactionId]
      );
    }

    await pool.execute("DELETE FROM cart_items WHERE advertiser_id = ?", [advertiserId]);

    return { success: true };
  } catch (error) {
    console.error("Checkout Error:", error);
    return { success: false, error: "Checkout failed" };
  }
}

export async function getAdvertiserCampaigns() {
  try {
    // Assuming you have a helper to get the logged-in advertiser's ID
    const advertiserId = await getAdvertiserId(); 
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT 
        b.id as booking_id, 
        b.campaign_name, 
        b.start_date, 
        b.end_date, 
        b.total_amount, 
        b.status, 
        b.artwork_url, 
        b.created_at,
        h.hoarding_id_string, 
        h.location, 
        h.size, 
        h.city,
        sar.after_photo_url as installation_photo
       FROM bookings b
       JOIN hoardings h ON b.hoarding_id = h.id
       LEFT JOIN auditor_assignments aa ON b.id = aa.booking_id
       LEFT JOIN site_audit_reports sar ON aa.id = sar.assignment_id
       WHERE b.advertiser_id = ?
       ORDER BY b.created_at DESC`,
      [advertiserId]
    );

    return { success: true, data: rows };
  } catch (error) {
    console.error("Fetch Campaigns Error:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function getInvoices() {
  try {
    const advertiserId = await getAdvertiserId();
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT 
        p.id as payment_id, p.transaction_id, p.payment_date, p.amount, p.status as payment_status, p.payment_method,
        b.id as booking_id, b.campaign_name, b.advertiser_name, b.start_date, b.end_date,
        h.hoarding_id_string, h.location, h.size, h.city
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN hoardings h ON b.hoarding_id = h.id
       WHERE b.advertiser_id = ?
       ORDER BY p.payment_date DESC`,
      [advertiserId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch invoices" };
  }
}

export async function getSupportTickets() {
  try {
    const advertiserId = await getAdvertiserId();
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT id, subject, message, status, created_at, updated_at 
       FROM support_tickets 
       WHERE advertiser_id = ? 
       ORDER BY created_at DESC`,
      [advertiserId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch support tickets" };
  }
}

export async function createSupportTicket(formData: FormData) {
  try {
    const advertiserId = await getAdvertiserId();
    if (!advertiserId) return { success: false, error: "Unauthorized" };

    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!subject || !message) {
      return { success: false, error: "Subject and message are required" };
    }

    await pool.execute(
      `INSERT INTO support_tickets (advertiser_id, subject, message) 
       VALUES (?, ?, ?)`,
      [advertiserId, subject, message]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create support ticket" };
  }
}

export async function getFilterOptions() {
  try {
    type FilterRow = { city?: string | null; media_type?: string | null };

    const [cities] = (await pool.execute(
      `SELECT DISTINCT city FROM hoardings WHERE city IS NOT NULL AND city != '' AND admin_status = 'Approved'`
    )) as unknown as [FilterRow[]];

    const [types] = (await pool.execute(
      `SELECT DISTINCT media_type FROM hoardings WHERE media_type IS NOT NULL AND media_type != '' AND admin_status = 'Approved'`
    )) as unknown as [FilterRow[]];

    return {
      success: true,
      cities: cities.map((c) => c.city).filter((city): city is string => !!city),
      mediaTypes: types.map((t) => t.media_type).filter((mediaType): mediaType is string => !!mediaType),
    };
  } catch (error) {
    return { success: false, cities: [], mediaTypes: [] };
  }
}


// export async function searchInventory(filters: { city?: string; type?: string; q?: string }) {
//   try {
//     let query = `
//       SELECT id, hoarding_id_string, location, gps_coordinates, size, daily_traffic, 
//              demand_category, status, available_from, media_type, base_price, city 
//       FROM hoardings 
//       WHERE 1=1
//     `;
//     const params: (string | number)[] = [];

//     if (filters.city && filters.city !== "All") {
//       query += ` AND city = ?`;
//       params.push(filters.city);
//     }
//     if (filters.type && filters.type !== "All") {
//       query += ` AND media_type = ?`;
//       params.push(filters.type);
//     }
//     if (filters.q) {
//       query += ` AND (location LIKE ? OR hoarding_id_string LIKE ?)`;
//       params.push(`%${filters.q}%`, `%${filters.q}%`);
//     }

//     const [rows] = await pool.execute(query, params);
//     return { success: true, data: rows };
//   } catch (error) {
//     return { success: false, error: "Search failed" };
//   }
// }

export async function searchInventory({ q = "", city = "All", type = "All", page = 1, limit = 10 }) {
  try {
    let query = `SELECT * FROM hoardings WHERE admin_status = 'Approved'`;
    const queryParams: (string | number)[] = [];

    if (q) {
      query += ` AND (location LIKE ? OR hoarding_id_string LIKE ?)`;
      queryParams.push(`%${q}%`, `%${q}%`);
    }
    if (city !== "All") {
      query += ` AND city = ?`;
      queryParams.push(city);
    }
    if (type !== "All") {
      query += ` AND media_type = ?`;
      queryParams.push(type);
    }

    const offset = (page - 1) * limit;
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    
    const finalParams = [...queryParams, limit.toString(), offset.toString()];

    const [rows] = await pool.execute(query, finalParams) as [unknown[], unknown];
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, data: [] };
  }
}