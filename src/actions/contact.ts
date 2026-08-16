"use server";

import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";

type ContactRequestCountRow = RowDataPacket & {
  total: number;
};

export async function submitContactRequest(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const { name, email, phone, subject, message } = formData;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO contact_requests (name, email, phone, subject, message, status, created_at) 
       VALUES (?, ?, ?, ?, ?, 'Pending', NOW())`,
      [name, email, phone, subject, message]
    );

    return { success: true, id: result.insertId };
  } catch (error) {
    return { success: false, error: "Failed to submit contact request" };
  }
}

export async function getContactRequests({
  page = 1,
  limit = 20,
  search = "",
  status = "All",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  try {
    const offset = (page - 1) * limit;
    const queryParams: string[] = [];
    let whereClause = "WHERE 1=1";

    if (search) {
      whereClause += " AND (name LIKE ? OR email LIKE ? OR subject LIKE ?)";
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (status && status !== "All") {
      whereClause += " AND status = ?";
      queryParams.push(status);
    }

    const countQuery = `SELECT COUNT(*) as total FROM contact_requests ${whereClause}`;
    const [countRows] = await pool.execute<ContactRequestCountRow[]>(countQuery, queryParams);
    const totalItems = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.ceil(totalItems / limit);

    const dataQuery = `
      SELECT id, name, email, phone, subject, message, status, created_at 
      FROM contact_requests 
      ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...queryParams, limit.toString(), offset.toString()];
    const [rows] = await pool.execute<RowDataPacket[]>(dataQuery, dataParams);

    return {
      success: true,
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch contact requests" };
  }
}

export async function updateContactRequestStatus(id: number | string, status: string) {
  try {
    await pool.execute(
      "UPDATE contact_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}