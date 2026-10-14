"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

interface AuditorRow extends RowDataPacket {
  id: number;
  name: string;
  city: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  password: string;
  role: string;
  auditor_id: number | null;
}

interface FieldExecutiveRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  auditor_id: number | null;
}

export async function getAuditorsList() {
  try {
    const [rows] = await pool.execute<AuditorRow[]>(
      "SELECT id, name, city FROM users WHERE role = 'AUDITOR'"
    );
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function registerFieldExecutive(data: FieldExecutiveRegistrationData) {
  try {
    const { name, email, phone, password, auditor_id } = data;
    
    const [existing] = await pool.execute<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return { success: false, message: "Email already registered" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, phone, password, role, auditor_id) VALUES (?, ?, ?, ?, 'FIELD_EXECUTIVE', ?)",
      [name, email, phone, hashedPassword, auditor_id]
    );

    return { success: true, message: "Registration successful! Pending Auditor verification." };
  } catch (error) {
    return { success: false, message: "Server error during registration." };
  }
}

export async function loginFieldExecutive(email: string, password: string) {
  try {
    const [rows] = await pool.execute<UserRow[]>(
      "SELECT id, name, password, role, auditor_id FROM users WHERE email = ? AND role = 'FIELD_EXECUTIVE'",
      [email]
    );

    if (rows.length === 0) return { success: false, message: "Invalid credentials or unauthorized role." };

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return { success: false, message: "Incorrect password." };

    (await cookies()).set("user_session", JSON.stringify({ id: user.id, name: user.name, role: user.role, auditor_id: user.auditor_id }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });

    return { success: true, message: "Login successful!" };
  } catch (error) {
    return { success: false, message: "Server error during login." };
  }
}