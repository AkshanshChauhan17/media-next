"use server";

import { cache } from "react";
import type { RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import * as xlsx from "xlsx";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "bookmyadspace_super_secret_key");

function normalizeExcelValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return String(value).trim();
}

async function getUserId() {
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

export const getActiveCategories = cache(async () => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT name, slug, icon FROM categories WHERE status = 'ACTIVE' ORDER BY created_at DESC"
    );
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
});

export const getCategoryDetails = cache(async (slug: string) => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM categories WHERE slug = ? LIMIT 1",
      [slug]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
});

export const getMediaInventory = cache(async (categoryId: number) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM media_items WHERE category_id = ? ORDER BY created_at DESC",
      [categoryId]
    );

    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
});

export async function getActiveLocations() {
  try {
    const [rows] = await pool.execute(
      "SELECT DISTINCT state, city FROM hoardings WHERE state IS NOT NULL AND state != '' AND city IS NOT NULL AND city != '' ORDER BY state ASC, city ASC"
    );

    const locationsData = (rows as { state: string; city: string }[]).reduce<
      { state: string; cities: string[] }[]
    >((acc, row) => {
      const existingState = acc.find(item => item.state === row.state);
      
      if (existingState) {
        existingState.cities.push(row.city);
      } else {
        acc.push({
          state: row.state,
          cities: [row.city]
        });
      }
      
      return acc;
    }, []);

    console.log(locationsData);

    return { success: true, data: locationsData };
  } catch (error) {
    return { success: false, error: "Failed to fetch locations" };
  }
}

export async function getHoardingDetails(id: number) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT h.*, u.name as media_owner_name 
       FROM hoardings h 
       JOIN users u ON h.media_owner_id = u.id 
       WHERE h.id = ?`,
      [id]
    );

    const data = rows as RowDataPacket[];
    if (data.length === 0) return { success: false, error: "Not found" };

    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: "Failed to fetch details" };
  }
}

export async function addToCart(hoardingId: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM cart_items WHERE advertiser_id = ? AND hoarding_id = ?",
      [userId, hoardingId]
    );

    if (existing.length > 0) {
      return { success: false, error: "Item already in cart" };
    }

    await pool.execute(
      "INSERT INTO cart_items (advertiser_id, hoarding_id) VALUES (?, ?)",
      [userId, hoardingId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function getMarketplaceHoardings(city?: string) {
  try {
    let query = `
      SELECT h.*, u.name as media_owner_name 
      FROM hoardings h 
      JOIN users u ON h.media_owner_id = u.id 
      WHERE h.admin_status = 'Approved'
    `;
    const params: string[] = [];

    if (city && city !== "All") {
      query += " AND h.city = ?";
      params.push(city);
    }

    query += " ORDER BY h.created_at DESC";

    const [rows] = await pool.execute(query, params);

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch hoardings" };
  }
}

export async function bulkUploadHoardings(formData: FormData) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file uploaded" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet);

    if (data.length === 0) return { success: false, error: "Empty file or wrong format" };

    let importedCount = 0;
    let skippedCount = 0;

    for (const rawRow of data) {
      const row: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(rawRow as Record<string, unknown>)) {
        row[String(key).trim().toUpperCase()] = value;
      }

      const city = String(row["CITY"] ?? "").trim();
      const location = String(row["LOCATION"] ?? "").trim();

      if (!city || !location) continue;

      const [existing] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM hoardings WHERE media_owner_id = ? AND city = ? AND location = ?",
        [userId, city, location]
      );

      if (existing.length > 0) {
        skippedCount++;
        continue;
      }

      const width = String(row["W"] ?? "").trim();
      const height = String(row["H"] ?? "").trim();
      const size = width && height ? `${width}ft x ${height}ft` : "Unknown";

      const rate = Number(row["RATE"] ?? 0) || 0;

      const prefix = city.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const hoardingIdString = `${prefix}-${randomNum}`;

      const gpsCoordinates = "0.000000, 0.000000";

      let mediaType = "Static Billboard";
      if (String(row["MEDIA"] ?? "").toUpperCase().includes("DIGITAL")) {
        mediaType = "Digital Display";
      }

      const query = `INSERT INTO hoardings (media_owner_id, hoarding_id_string, location, gps_coordinates, size, media_type, base_price, city, status, admin_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params: Array<string | number> = [
        userId,
        hoardingIdString,
        location,
        gpsCoordinates,
        size,
        mediaType,
        rate,
        city,
        "Vacant",
        "Pending"
      ];

      await pool.execute(query, params);

      importedCount++;
    }

    return { success: true, count: importedCount, skipped: skippedCount };
  } catch (error) {
    return { success: false, error: "Failed to process Excel file" };
  }
}

export async function getLatestMediaStories() {
  try {
    const [rows] = await pool.execute(
      `SELECT id, city, location, image_url 
       FROM hoardings 
       WHERE admin_status = 'Approved' 
       ORDER BY created_at DESC 
       LIMIT 20`
    );
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch stories" };
  }
}

export async function searchHoardings(query: string) {
  try {
    if (!query || query.length < 2) return { success: true, data: [] };

    const searchTerm = `%${query}%`;
    const [rows] = await pool.execute(
      `SELECT id, city, location, image_url 
       FROM hoardings 
       WHERE admin_status = 'Approved' 
       AND (city LIKE ? OR location LIKE ? OR hoarding_id_string LIKE ?) 
       LIMIT 5`,
      [searchTerm, searchTerm, searchTerm]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Search failed" };
  }
}

export async function getHoardingsByBudget(budget: number) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, city, location, image_url, base_price, size, media_type 
       FROM hoardings 
       WHERE admin_status = 'Approved' AND base_price <= ? 
       ORDER BY base_price DESC 
       LIMIT 20`,
      [budget]
    );
    
    return { success: true, data: rows };
  } catch (error) {
    console.log(error)
    return { success: false, error: "Failed to fetch hoardings by budget" };
  }
}

export async function getFilteredHoardings(params: {
  city?: string;
  mediaType?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  offset?: number;
  limit?: number;
}) {
  try {
    let query = `SELECT id, hoarding_id_string, location, city, size, base_price, media_type, image_url FROM hoardings WHERE admin_status = 'Approved'`;
    const queryParams: (string | number)[] = [];

    if (params.city) {
      query += ` AND city LIKE ?`;
      queryParams.push(`%${params.city}%`);
    }
    if (params.mediaType) {
      query += ` AND media_type = ?`;
      queryParams.push(params.mediaType);
    }
    if (params.minPrice) {
      query += ` AND base_price >= ?`;
      queryParams.push(Number(params.minPrice));
    }
    if (params.maxPrice) {
      query += ` AND base_price <= ?`;
      queryParams.push(Number(params.maxPrice));
    }

    if (params.sortBy === 'price_asc') {
      query += ` ORDER BY base_price ASC`;
    } else if (params.sortBy === 'price_desc') {
      query += ` ORDER BY base_price DESC`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }

    const limit = Number(params.limit) || 10;
    const offset = Number(params.offset) || 0;
    
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.execute(query, queryParams);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch hoardings" };
  }
}

export async function getMediaRateEstimate(city: string, mediaType: string) {
  try {
    let query = `SELECT AVG(base_price) as avg_price, COUNT(id) as total_spaces FROM hoardings WHERE admin_status = 'Approved'`;
    const queryParams: Array<string | number> = [];

    if (city) {
      query += ` AND city LIKE ?`;
      queryParams.push(`%${city}%`);
    }
    if (mediaType) {
      query += ` AND media_type = ?`;
      queryParams.push(mediaType);
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, queryParams);
    const firstRow = rows[0] as (RowDataPacket & {
      avg_price: number | string | null;
      total_spaces: number | string | null;
    }) | undefined;

    return {
      success: true,
      data: {
        avg_price: firstRow?.avg_price ? Number(firstRow.avg_price) : 0,
        total_spaces: firstRow?.total_spaces ? Number(firstRow.total_spaces) : 0
      }
    };
  } catch (error) {
    return { success: false, error: "Calculation failed" };
  }
}

export async function getMapHoardings() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, hoarding_id_string, location, city, size, gps_coordinates, base_price, daily_traffic, image_url 
       FROM hoardings 
       WHERE admin_status = 'Approved'`
    );
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, data: [] };
  }
}