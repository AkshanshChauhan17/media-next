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
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}