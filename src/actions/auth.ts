"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type LoginFormData = {
  email: string;
  password: string;
};

type UserRecord = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "bookmyadspace_super_secret_key");

export async function getSessionUser() {
  const sessionCookie = (await cookies()).get("session");

  if (!sessionCookie || !sessionCookie.value) {
    return { success: false, user: null };
  }

  try {
    const token = sessionCookie.value;
    const payloadBase64 = token.split(".")[1];

    const decodedPayload = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const user = JSON.parse(decodedPayload);

    const auditorId = user.id || user.userId || user.sub;

    if (!auditorId) {
      return { success: false, user: null };
    }

    return { success: true, user: { ...user, id: auditorId } };
  } catch (error) {
    return { success: false, user: null };
  }
}

export async function registerUser(formData: RegisterFormData) {
  try {
    const { name, email, password, role } = formData;

    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if ((existingUsers as { id: number }[]).length > 0) {
      return { success: false, error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Registration failed" };
  }
}

export async function loginUser(formData: LoginFormData) {
  try {
    const { email, password } = formData;

    const [users] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = (users as UserRecord[])[0];

    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid credentials" };
    }

    const token = await new SignJWT({ id: user.id, role: user.role, name: user.name })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return { success: true, role: user.role };
  } catch (error) {
    return { success: false, error: "Login failed" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}

export async function registerAd(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string || "Advertiser";

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if ((existing as { id: number }[]).length > 0) {
      return { success: false, error: "Email already exists" };
    }

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role, kyc_status) VALUES (?, ?, ?, ?, 'Approved')",
      [name, email, password, role]
    );

    const insertId = (result as { insertId: number }).insertId;

    const cookieStore = await cookies();
    cookieStore.set("userId", insertId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    cookieStore.set("userRole", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return { success: true };
  } catch (error) {
    console.log(error)
    return { success: false, error: "Registration failed. Please try again." };
  }
}