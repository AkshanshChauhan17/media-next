"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { RowDataPacket } from "mysql2";
import fs from "fs/promises";
import path from "path";

type CategoryWithCount = RowDataPacket & {
  id: number;
  name: string;
  slug: string;
  seo_heading: string;
  seo_paragraphs: string;
  seo_table_data: string;
  status: string;
  created_at: string;
  media_count: number;
};

type MediaItemWithCategory = RowDataPacket & {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  location_city: string;
  price: string;
  image_url: string;
  created_at: string;
  category_name: string;
};

type CountRow = RowDataPacket & {
  count: number;
};

type FinancialRecordRow = RowDataPacket & {
  payment_id: number;
  transaction_id: string | null;
  amount: number | string | null;
  payment_date: string | null;
  payout_status: string | null;
  settled_at: string | null;
  campaign_name: string;
  advertiser_name: string;
  hoarding_id_string: string;
  media_owner_name: string;
  media_owner_email: string;
};

type PaymentAmountRow = RowDataPacket & {
  amount: number | string;
};

export async function getAdminData() {
  const [categories] = await pool.execute<CategoryWithCount[]>(`
    SELECT c.*, COUNT(m.id) as media_count 
    FROM categories c 
    LEFT JOIN media_items m ON c.id = m.category_id 
    GROUP BY c.id 
    ORDER BY c.created_at DESC
  `);
  
  const [mediaItems] = await pool.execute<MediaItemWithCategory[]>(`
    SELECT m.*, c.name as category_name 
    FROM media_items m 
    JOIN categories c ON m.category_id = c.id 
    ORDER BY m.created_at DESC
  `);
  
  const [catCount] = await pool.execute<CountRow[]>("SELECT COUNT(*) as count FROM categories");
  const [mediaCount] = await pool.execute<CountRow[]>("SELECT COUNT(*) as count FROM media_items");

  return { 
    categories, 
    mediaItems,
    recentMedia: mediaItems.slice(0, 5),
    stats: {
      totalCategories: catCount[0].count,
      totalMedia: mediaCount[0].count
    }
  };
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const icon = (formData.get("icon") as string) || "Folder";
  const seo_heading = formData.get("seo_heading") as string;
  const seo_paragraphs = formData.get("seo_paragraphs") as string;
  const seo_table_data = formData.get("seo_table_data") as string;

  let formattedParagraphs = "[]";

  try {
    if (seo_paragraphs) {
      formattedParagraphs = JSON.stringify(seo_paragraphs.split("\n").filter(p => p.trim() !== ""));
    }

    await pool.execute(
      `INSERT INTO categories (name, slug, icon, seo_heading, seo_paragraphs, seo_table_data, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [name, slug, icon, seo_heading, formattedParagraphs, seo_table_data]
    );

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/", "layout"); // 🔥 ADDED: Frontend ka cache turant clear karega
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}

export async function createMediaItem(formData: FormData) {
  const category_id = formData.get("category_id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const location_city = formData.get("location_city") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  let imageUrl = null;

  try {
    if (image && image.size > 0 && typeof image === 'object') {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), "public/uploads");
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (e) {}

      const filename = `${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/${filename}`;
    }

    await pool.execute(
      `INSERT INTO media_items (category_id, title, slug, location_city, price, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category_id, title, slug, location_city, price, imageUrl]
    );

    revalidatePath("/admin/media");
    revalidatePath("/admin");
    revalidatePath("/", "layout"); // 🔥 ADDED
    
    return { success: true };
  } catch (error) {
    console.error("Create media error:", error);
    return { success: false, error: "Database error" };
  }
}

export async function updateMediaItem(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const location_city = formData.get("location_city") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  try {
    let query = `UPDATE media_items SET title = ?, slug = ?, location_city = ?, price = ?`;
    const params: (string | number)[] = [title, slug, location_city, price];

    if (image && image.size > 0 && typeof image === 'object') {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), "public/uploads");
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (e) {}

      const filename = `${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      const imageUrl = `/uploads/${filename}`;

      query += `, image_url = ?`;
      params.push(imageUrl);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await pool.execute(query, params);

    revalidatePath("/admin/media");
    revalidatePath("/admin");
    revalidatePath("/", "layout"); // 🔥 ADDED
    
    return { success: true };
  } catch (error) {
    console.error("Update media error:", error);
    return { success: false, error: "Database error" };
  }
}

export async function updateCategory(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const icon = (formData.get("icon") as string) || "Folder";
  const seo_heading = formData.get("seo_heading") as string;
  const seo_paragraphs = formData.get("seo_paragraphs") as string;
  const seo_table_data = formData.get("seo_table_data") as string;

  let formattedParagraphs = "[]";

  try {
    if (seo_paragraphs) {
      formattedParagraphs = JSON.stringify(seo_paragraphs.split("\n").filter(p => p.trim() !== ""));
    }

    await pool.execute(
      `UPDATE categories 
       SET name = ?, slug = ?, icon = ?, seo_heading = ?, seo_paragraphs = ?, seo_table_data = ? 
       WHERE id = ?`,
      [name, slug, icon, seo_heading, formattedParagraphs, seo_table_data, id]
    );

    revalidatePath("/admin/categories");
    revalidatePath("/admin/media"); 
    revalidatePath("/admin");
    revalidatePath(`/media/${slug}`); 
    revalidatePath("/", "layout"); // 🔥 ADDED
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}

export async function toggleCategoryStatus(id: number, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    await pool.execute("UPDATE categories SET status = ? WHERE id = ?", [newStatus, id]);
    
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout"); // 🔥 ADDED
    
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteCategory(id: number) {
  try {
    await pool.execute("DELETE FROM categories WHERE id = ?", [id]);
    
    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/", "layout"); // 🔥 ADDED
    
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteMediaItem(id: number) {
  try {
    await pool.execute("DELETE FROM media_items WHERE id = ?", [id]);
    
    revalidatePath("/admin/media");
    revalidatePath("/admin");
    revalidatePath("/", "layout"); // 🔥 ADDED
    
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

//new section start from here

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "bookmyadspace_super_secret_key");

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    if (verified.payload.role !== "ADMIN") return null;
    return verified.payload.id as number;
  } catch {
    return null;
  }
}

export async function getDashboardStats() {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    // 1. Total Platform Revenue (Sum of all payments)
    const [revenueRows] = await pool.execute("SELECT SUM(amount) as total FROM payments WHERE status = 'Paid'");
    const totalRevenue = (revenueRows as Array<{ total: number | null }>)[0]?.total || 0;
    
    // Assuming platform takes 10% commission
    const platformEarnings = totalRevenue * 0.10;

    // 2. Active Campaigns
    const [campaignRows] = await pool.execute("SELECT COUNT(id) as count FROM bookings WHERE status = 'Accepted'");
    const activeCampaigns = (campaignRows as Array<{ count: number }>)[0]?.count || 0;

    // 3. Total Users
    const [userRows] = await pool.execute("SELECT COUNT(id) as count FROM users WHERE role IN ('MEDIA_OWNER', 'ADVERTISER')");
    const totalUsers = (userRows as Array<{ count: number }>)[0]?.count || 0;

    // 4. Pending KYC
    const [kycRows] = await pool.execute("SELECT COUNT(id) as count FROM users WHERE kyc_status = 'Pending'");
    const pendingKYC = (kycRows as Array<{ count: number }>)[0]?.count || 0;

    return { 
      success: true, 
      data: { totalRevenue, platformEarnings, activeCampaigns, totalUsers, pendingKYC } 
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function getPendingUsers() {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT id, name, email, role, phone, created_at 
       FROM users 
       WHERE kyc_status = 'Pending' 
       ORDER BY created_at ASC LIMIT 5`
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch pending users" };
  }
}

export async function getAllUsers(filters: { role?: string; kycStatus?: string; q?: string }) {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    // Exact columns mapped from the media_owner_kyc table image
    let query = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.role, u.city, u.kyc_status, u.created_at,
        k.business_name, 
        k.business_type,
        k.incorporation_date,
        k.gstin, 
        k.pan, 
        k.address,
        k.account_name,
        k.account_number,
        k.ifsc,
        k.bank_name,
        k.gst_file_url,
        k.pan_file_url,
        k.cheque_file_url
      FROM users u
      LEFT JOIN media_owner_kyc k ON u.id = k.user_id
      WHERE u.role != 'ADMIN'
    `;
    const params: (string | number)[] = [];

    // Filter by role
    if (filters.role && filters.role !== "All") {
      query += ` AND u.role = ?`;
      params.push(filters.role);
    }
    
    // Filter by KYC status
    if (filters.kycStatus && filters.kycStatus !== "All") {
      query += ` AND u.kyc_status = ?`;
      params.push(filters.kycStatus);
    }
    
    // Search query
    if (filters.q) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      params.push(`%${filters.q}%`, `%${filters.q}%`, `%${filters.q}%`);
    }

    query += ` ORDER BY u.created_at DESC`;

    const [rows] = await pool.execute(query, params);
    
    // Logging to verify data format in terminal
    console.log("Fetched Users with Exact KYC:", rows);
    
    return { success: true, data: rows };
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function updateKycStatus(userId: number, status: 'Approved' | 'Rejected') {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Update status in the users table
      await connection.execute(
        "UPDATE users SET kyc_status = ? WHERE id = ?",
        [status, userId]
      );

      const kycTableStatus = status === 'Approved' ? 'Verified' : 'Rejected';
      
      await connection.execute(
        "UPDATE media_owner_kyc SET status = ? WHERE user_id = ?",
        [kycTableStatus, userId]
      );

      await connection.commit();
      return { success: true };
    } catch (transactionError) {
      await connection.rollback();
      throw transactionError; 
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("KYC Update Error:", error);
    return { success: false, error: "Failed to update KYC status" };
  }
}

export async function getAllHoardings(filters: { status?: string; city?: string; q?: string }) {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    let query = `
      SELECT h.*, u.name as media_owner_name, u.email as media_owner_email, u.phone as media_owner_phone
      FROM hoardings h
      JOIN users u ON h.media_owner_id = u.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (filters.status && filters.status !== "All") {
      query += ` AND h.admin_status = ?`;
      params.push(filters.status);
    }
    if (filters.city && filters.city !== "All") {
      query += ` AND h.city = ?`;
      params.push(filters.city);
    }
    if (filters.q) {
      query += ` AND (h.hoarding_id_string LIKE ? OR h.location LIKE ? OR u.name LIKE ?)`;
      params.push(`%${filters.q}%`, `%${filters.q}%`, `%${filters.q}%`);
    }

    query += ` ORDER BY h.created_at DESC`;

    const [rows] = await pool.execute(query, params);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch global inventory" };
  }
}

export async function updateHoardingAdminStatus(hoardingId: number, status: 'Approved' | 'Blocked') {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    await pool.execute(
      "UPDATE hoardings SET admin_status = ? WHERE id = ?",
      [status, hoardingId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update hoarding status" };
  }
}

export async function getFinancialRecords(filters: { status?: string; q?: string }) {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    let query = `
      SELECT 
        p.id as payment_id, p.transaction_id, p.amount, p.payment_date, p.payout_status, p.settled_at,
        b.campaign_name, b.advertiser_name,
        h.hoarding_id_string,
        mo.name as media_owner_name, mo.email as media_owner_email
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN hoardings h ON b.hoarding_id = h.id
      JOIN users mo ON p.media_owner_id = mo.id
      WHERE p.status = 'Paid'
    `;
    const params: (string | number)[] = [];

    if (filters.status && filters.status !== "All") {
      query += ` AND p.payout_status = ?`;
      params.push(filters.status);
    }
    
    if (filters.q) {
      query += ` AND (p.transaction_id LIKE ? OR b.campaign_name LIKE ? OR mo.name LIKE ?)`;
      params.push(`%${filters.q}%`, `%${filters.q}%`, `%${filters.q}%`);
    }

    query += ` ORDER BY p.payment_date DESC`;

    const [rows] = await pool.execute(query, params as (string | number)[]);

    const formattedRows: Array<FinancialRecordRow & { commission: number; payout: number; total: number }> =
      (rows as FinancialRecordRow[]).map((row) => {
        const total = Number(row.amount ?? 0);
        const commission = total * 0.10;
        const payout = total - commission;
        return { ...row, commission, payout, total };
      });

    return { success: true, data: formattedRows };
  } catch (error) {
    return { success: false, error: "Failed to fetch financial records" };
  }
}

export async function processPayout(paymentId: number) {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    const [paymentRows] = await pool.execute<PaymentAmountRow[]>("SELECT amount FROM payments WHERE id = ?", [paymentId]);
    const payment = paymentRows[0];

    if (!payment) {
      return { success: false, error: "Payment not found" };
    }

    const amount = Number(payment.amount);
    const commission = amount * 0.10;
    const payout = amount - commission;

    await pool.execute(
      `UPDATE payments 
       SET payout_status = 'Settled', 
           platform_commission = ?, 
           payout_amount = ?, 
           settled_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [commission, payout, paymentId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to process payout" };
  }
}

export async function getGlobalAlerts() {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT ha.id, ha.alert_type, ha.issue_description, ha.severity, ha.is_resolved, ha.created_at,
              h.hoarding_id_string, h.location, h.city,
              mo.name as media_owner_name
       FROM hoarding_alerts ha
       JOIN hoardings h ON ha.hoarding_id = h.id
       JOIN users mo ON ha.media_owner_id = mo.id
       ORDER BY 
         CASE ha.severity WHEN 'Critical' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END,
         ha.created_at DESC`
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch global alerts" };
  }
}

export async function getGlobalAudits() {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT sar.id, sar.before_photo_url, sar.after_photo_url, sar.latitude, sar.longitude, 
              sar.light_working, sar.structure_damaged, sar.damage_rating, sar.created_at,
              h.hoarding_id_string, h.location,
              au.name as auditor_name,
              b.campaign_name
       FROM site_audit_reports sar
       JOIN auditor_assignments aa ON sar.assignment_id = aa.id
       JOIN hoardings h ON aa.hoarding_id = h.id
       JOIN users au ON sar.auditor_id = au.id
       JOIN bookings b ON aa.booking_id = b.id
       ORDER BY sar.created_at DESC`
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch global audits" };
  }
}

export async function getAllSupportTickets(filters: { status?: string; q?: string }) {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    let query = `
      SELECT st.*, u.name as user_name, u.email as user_email, u.role as user_role 
      FROM support_tickets st
      JOIN users u ON st.advertiser_id = u.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (filters.status && filters.status !== "All") {
      query += ` AND st.status = ?`;
      params.push(filters.status);
    }
    
    if (filters.q) {
      query += ` AND (st.subject LIKE ? OR u.name LIKE ? OR st.id LIKE ?)`;
      params.push(`%${filters.q}%`, `%${filters.q}%`, `%${filters.q}%`);
    }

    query += ` ORDER BY 
      CASE st.status WHEN 'Open' THEN 1 WHEN 'In Progress' THEN 2 ELSE 3 END, 
      st.created_at DESC`;

    const [rows] = await pool.execute(query, params);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch support tickets" };
  }
}

export async function resolveSupportTicket(ticketId: number, status: string, adminResponse: string) {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    await pool.execute(
      `UPDATE support_tickets 
       SET status = ?, admin_response = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, adminResponse, ticketId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update ticket" };
  }
}

export async function getAssignmentTasks() {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    // Fetch active/accepted bookings and their current assignment status
    const [rows] = await pool.execute(
      `SELECT 
        b.id as booking_id, b.campaign_name, b.start_date, b.end_date, b.status as booking_status,
        h.id as hoarding_id, h.hoarding_id_string, h.location, h.city,
        mo.name as media_owner_name,
        aa.id as assignment_id, aa.status as assignment_status,
        au.id as auditor_id, au.name as auditor_name
       FROM bookings b
       JOIN hoardings h ON b.hoarding_id = h.id
       JOIN users mo ON h.media_owner_id = mo.id
       LEFT JOIN auditor_assignments aa ON b.id = aa.booking_id
       LEFT JOIN users au ON aa.auditor_id = au.id
       WHERE b.status IN ('Accepted', 'Active', 'Completed') 
       ORDER BY b.start_date DESC`
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch assignment tasks" };
  }
}

export async function getAvailableAuditors() {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT id, name, city, phone 
       FROM users 
       WHERE role = 'AUDITOR' AND kyc_status = 'Approved'`
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch auditors" };
  }
}

export async function assignAuditorToBooking(bookingId: number, hoardingId: number, auditorId: number) {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) return { success: false, error: "Unauthorized" };

    const [existing] = await pool.execute(
      "SELECT id FROM auditor_assignments WHERE booking_id = ?",
      [bookingId]
    );

    if ((existing as Array<{id: number}>).length > 0) {
      await pool.execute(
        "UPDATE auditor_assignments SET auditor_id = ?, status = 'Assigned' WHERE booking_id = ?",
        [auditorId, bookingId]
      );
    } else {
      await pool.execute(
        "INSERT INTO auditor_assignments (booking_id, hoarding_id, auditor_id, status) VALUES (?, ?, ?, 'Assigned')",
        [bookingId, hoardingId, auditorId]
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Assignment Error:", error);
    return { success: false, error: "Failed to assign auditor" };
  }
}