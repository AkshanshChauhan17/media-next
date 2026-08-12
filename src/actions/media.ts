"use server";

import type { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

export async function getCategoryDetails(slug: string) {
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
}

export async function getMediaInventory(categoryId: number) {
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
}