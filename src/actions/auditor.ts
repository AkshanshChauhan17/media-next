"use server";

import pool from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "bookmyadspace_super_secret_key");

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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

export async function verifyAndSubmitAudit(formData: FormData) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const hoardingId = parseInt(formData.get("hoardingId") as string, 10);
    const qrCode = formData.get("qrCode") as string;
    const currentLat = parseFloat(formData.get("lat") as string);
    const currentLng = parseFloat(formData.get("lng") as string);
    const photoFile = formData.get("photoFile") as File;
    const fileLastModified = parseInt(formData.get("lastModified") as string, 10);

    if (!hoardingId || !qrCode || isNaN(currentLat) || isNaN(currentLng) || !photoFile) {
      return { success: false, status: "Auto-Rejected", reason: "Missing required scan data." };
    }

    const [hoardingRows] = await pool.execute(
      "SELECT gps_coordinates, hoarding_id_string FROM hoardings WHERE id = ?",
      [hoardingId]
    );
    const hoarding = (hoardingRows as Array<{ gps_coordinates: string; hoarding_id_string: string }>)[0];
    
    if (!hoarding) {
      return { success: false, status: "Auto-Rejected", reason: "Invalid Hoarding ID." };
    }

    if (qrCode !== hoarding.hoarding_id_string) {
      return { success: false, status: "Auto-Rejected", reason: "QR Code does not match this hoarding." };
    }

    const timeDiffMinutes = (Date.now() - fileLastModified) / (1000 * 60);
    if (timeDiffMinutes > 30) {
      return { success: false, status: "Auto-Rejected", reason: "Old photo detected. Must be captured live." };
    }

    const [gpsLatStr, gpsLngStr] = hoarding.gps_coordinates.replace(/[^\d.\-,]/g, '').split(',');
    const hLat = parseFloat(gpsLatStr);
    const hLng = parseFloat(gpsLngStr);
    
    if (!isNaN(hLat) && !isNaN(hLng)) {
      const distance = calculateDistance(currentLat, currentLng, hLat, hLng);
      if (distance > 200) { 
        return { success: false, status: "Auto-Rejected", reason: `Fake GPS detected. You are ${Math.round(distance)}m away from the hoarding.` };
      }
    }

    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const photoHash = crypto.createHash('sha256').update(buffer).digest('hex');

    const [duplicateRows] = await pool.execute(
      "SELECT id FROM audit_reports WHERE photo_hash = ?",
      [photoHash]
    );

    if ((duplicateRows as Array<{ id: number }>).length > 0) {
      return { success: false, status: "Auto-Rejected", reason: "Fraud Alert: Same photo re-used from a previous audit." };
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/audits");
    await mkdir(uploadDir, { recursive: true });
    
    const cleanFileName = photoFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `audit_${hoardingId}_${Date.now()}_${cleanFileName}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const photoUrl = `/uploads/audits/${fileName}`;

    await pool.execute(
      `INSERT INTO audit_reports 
      (auditor_id, hoarding_id, qr_code_scanned, photo_url, photo_hash, captured_lat, captured_lng, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Approved')`,
      [userId, hoardingId, qrCode, photoUrl, photoHash, currentLat, currentLng]
    );

    return { success: true, status: "Approved" };

  } catch (error) {
    return { success: false, error: "System error during audit submission." };
  }
}

async function getAuditorId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    if (verified.payload.role !== "AUDITOR") return null;
    return verified.payload.id as number;
  } catch {
    return null;
  }
}

export async function getAssignedCampaigns() {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT aa.id as assignment_id, aa.status, aa.assigned_date, 
              b.campaign_name, b.advertiser_name, 
              h.id as hoarding_id, h.hoarding_id_string, h.location, h.gps_coordinates, h.size
       FROM auditor_assignments aa
       JOIN bookings b ON aa.booking_id = b.id
       JOIN hoardings h ON aa.hoarding_id = h.id
       WHERE aa.auditor_id = ?
       ORDER BY 
         CASE aa.status 
           WHEN 'Assigned' THEN 1 
           WHEN 'Visited' THEN 2 
           WHEN 'Completed' THEN 3 
         END, 
         aa.assigned_date DESC`,
      [auditorId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch assignments" };
  }
}


export async function submitSiteVerification(formData: FormData) {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    const assignmentId = parseInt(formData.get("assignmentId") as string, 10);
    const hoardingId = parseInt(formData.get("hoardingId") as string, 10);
    const currentLat = parseFloat(formData.get("lat") as string);
    const currentLng = parseFloat(formData.get("lng") as string);

    const lightWorking = formData.get("lightWorking") === "true" ? 1 : 0;
    const structureDamaged = formData.get("structureDamaged") === "true" ? 1 : 0;
    const damageRating = formData.get("damageRating") as string;
    const tornFlex = formData.get("tornFlex") === "true" ? 1 : 0;
    const flexMounted = formData.get("flexMounted") === "true" ? 1 : 0;
    const obstructionPresent = formData.get("obstructionPresent") === "true" ? 1 : 0;

    const beforePhoto = formData.get("beforePhoto") as File;
    const afterPhoto = formData.get("afterPhoto") as File;

    if (!beforePhoto || !afterPhoto) {
      return { success: false, error: "Both Before and After photos are required." };
    }

    const [hoardingRows] = await pool.execute(
      "SELECT gps_coordinates, media_owner_id FROM hoardings WHERE id = ?",
      [hoardingId]
    );
    const hoarding = (hoardingRows as { gps_coordinates?: string; media_owner_id?: number | null }[])[0];
    const mediaOwnerId = Number(hoarding?.media_owner_id ?? 0);

    if (hoarding && hoarding.gps_coordinates) {
      const [hLat, hLng] = hoarding.gps_coordinates.replace(/[^\d,.-]/g, '').split(',').map(Number);
      if (!isNaN(hLat) && !isNaN(hLng)) {
        const distance = calculateDistance(currentLat, currentLng, hLat, hLng);
        if (distance > 500) {
          return { success: false, error: `Geo-Fence Violation: You are ${Math.round(distance)}m away from the site. Must be within 500 meters.` };
        }
      }
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/audits");
    await mkdir(uploadDir, { recursive: true });

    const saveFile = async (file: File, prefix: string) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${prefix}_${assignmentId}_${Date.now()}_${cleanFileName}`;
      await writeFile(path.join(uploadDir, fileName), buffer);
      return `/uploads/audits/${fileName}`;
    };

    const beforeUrl = await saveFile(beforePhoto, "before");
    const afterUrl = await saveFile(afterPhoto, "after");

    await pool.execute(
      `INSERT INTO site_audit_reports 
      (assignment_id, auditor_id, before_photo_url, after_photo_url, light_working, structure_damaged, damage_rating, torn_flex, flex_mounted, obstruction_present, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [assignmentId, auditorId, beforeUrl, afterUrl, lightWorking, structureDamaged, damageRating, tornFlex, flexMounted, obstructionPresent, currentLat, currentLng]
    );

    await pool.execute(
      "UPDATE auditor_assignments SET status = 'Completed' WHERE id = ?",
      [assignmentId]
    );

    if (!lightWorking && mediaOwnerId > 0) {
      await pool.execute(
        `INSERT INTO hoarding_alerts (hoarding_id, media_owner_id, alert_type, issue_description, severity) VALUES (?, ?, ?, ?, ?)`,
        [hoardingId, mediaOwnerId, "Lighting Issue", "Auditor reported that the lighting system is not working.", "Medium"]
      );
    }

    if (structureDamaged && mediaOwnerId > 0) {
      await pool.execute(
        `INSERT INTO hoarding_alerts (hoarding_id, media_owner_id, alert_type, issue_description, severity) VALUES (?, ?, ?, ?, ?)`,
        [hoardingId, mediaOwnerId, "Structural Damage", `Auditor reported structure damage. Rating: ${damageRating}.`, damageRating === 'Critical' ? 'Critical' : 'Medium']
      );
    }

    if (tornFlex && mediaOwnerId > 0) {
      await pool.execute(
        `INSERT INTO hoarding_alerts (hoarding_id, media_owner_id, alert_type, issue_description, severity) VALUES (?, ?, ?, ?, ?)`,
        [hoardingId, mediaOwnerId, "Flex Damage", "Auditor reported that the flex is torn or faded.", "Medium"]
      );
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit verification report." };
  }
}

export async function getAuditReports() {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT sar.*, 
              aa.assigned_date, 
              b.campaign_name, b.advertiser_name, 
              h.hoarding_id_string, h.location 
       FROM site_audit_reports sar
       JOIN auditor_assignments aa ON sar.assignment_id = aa.id
       JOIN bookings b ON aa.booking_id = b.id
       JOIN hoardings h ON aa.hoarding_id = h.id
       WHERE sar.auditor_id = ?
       ORDER BY sar.created_at DESC`,
      [auditorId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch audit reports" };
  }
}

export async function getAuditorHoardings() {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    // Fetch unique hoardings currently assigned to this auditor
    const [rows] = await pool.execute(
      `SELECT DISTINCT h.id, h.hoarding_id_string, h.location, h.gps_coordinates
       FROM auditor_assignments aa
       JOIN hoardings h ON aa.hoarding_id = h.id
       WHERE aa.auditor_id = ?`,
      [auditorId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch hoardings" };
  }
}

export async function getDamageReports() {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT adr.*, h.hoarding_id_string, h.location 
       FROM auditor_damage_reports adr
       JOIN hoardings h ON adr.hoarding_id = h.id
       WHERE adr.auditor_id = ?
       ORDER BY adr.reported_at DESC`,
      [auditorId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch damage reports" };
  }
}

export async function submitDamageReport(formData: FormData) {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    const hoardingId = parseInt(formData.get("hoardingId") as string, 10);
    const damageType = formData.get("damageType") as string;
    const severity = formData.get("severity") as string;
    const description = formData.get("description") as string;
    const currentLat = parseFloat(formData.get("lat") as string);
    const currentLng = parseFloat(formData.get("lng") as string);
    const photoFile = formData.get("photoFile") as File;

    if (!photoFile) {
      return { success: false, error: "Live damage photo is required." };
    }

    const [hoardingRows] = await pool.execute(
      "SELECT gps_coordinates, media_owner_id FROM hoardings WHERE id = ?", 
      [hoardingId]
    );
    const hoarding = (hoardingRows as Array<{ gps_coordinates: string; media_owner_id: number }>)[0];
    
    if (hoarding && hoarding.gps_coordinates) {
      const [hLat, hLng] = hoarding.gps_coordinates.replace(/[^\d.,\-]/g, '').split(',').map(Number);
      if (!isNaN(hLat) && !isNaN(hLng)) {
        const distance = calculateDistance(currentLat, currentLng, hLat, hLng);
        if (distance > 500) {
          return { success: false, error: `Geo-Fence Violation: You are ${Math.round(distance)}m away from the site. Must be within 500 meters.` };
        }
      }
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/damages");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanFileName = photoFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `damage_${hoardingId}_${Date.now()}_${cleanFileName}`;
    await writeFile(path.join(uploadDir, fileName), buffer);
    const photoUrl = `/uploads/damages/${fileName}`;

    await pool.execute(
      `INSERT INTO auditor_damage_reports 
      (auditor_id, hoarding_id, damage_type, severity, description, photo_url, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [auditorId, hoardingId, damageType, severity, description, photoUrl, currentLat, currentLng]
    );

    await pool.execute(
      `INSERT INTO hoarding_alerts (hoarding_id, media_owner_id, alert_type, issue_description, severity) 
       VALUES (?, ?, ?, ?, ?)`,
      [hoardingId, hoarding.media_owner_id, `Auditor Report: ${damageType}`, description, severity]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit damage report." };
  }
}

export async function getCompletionTasks() {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    // Fetch assignments where campaign is nearing end or ended, 
    // and no completion report exists yet.
    const [rows] = await pool.execute(
      `SELECT aa.id as assignment_id, b.campaign_name, b.advertiser_name, b.end_date,
              h.id as hoarding_id, h.hoarding_id_string, h.location, h.gps_coordinates, h.size,
              ccr.id as completion_id
       FROM auditor_assignments aa
       JOIN bookings b ON aa.booking_id = b.id
       JOIN hoardings h ON aa.hoarding_id = h.id
       LEFT JOIN campaign_completion_reports ccr ON aa.id = ccr.assignment_id
       WHERE aa.auditor_id = ? AND aa.status = 'Completed'
       ORDER BY b.end_date ASC`,
      [auditorId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch completion tasks" };
  }
}

export async function submitCompletionReport(formData: FormData) {
  try {
    const auditorId = await getAuditorId();
    if (!auditorId) return { success: false, error: "Unauthorized" };

    const assignmentId = parseInt(formData.get("assignmentId") as string, 10);
    const hoardingId = parseInt(formData.get("hoardingId") as string, 10);
    const currentLat = parseFloat(formData.get("lat") as string);
    const currentLng = parseFloat(formData.get("lng") as string);

    const lightWorking = formData.get("lightWorking") === "true" ? 1 : 0;
    const structureDamaged = formData.get("structureDamaged") === "true" ? 1 : 0;
    const damageRating = formData.get("damageRating") as string;
    const tornFlex = formData.get("tornFlex") === "true" ? 1 : 0;
    const flexMounted = formData.get("flexMounted") === "true" ? 1 : 0;
    const obstructionPresent = formData.get("obstructionPresent") === "true" ? 1 : 0;

    const photoFile = formData.get("photoFile") as File;

    if (!photoFile) {
      return { success: false, error: "Live removal photo is required." };
    }

    // Geo-fencing verification
    const [hoardingRows] = await pool.execute(
      "SELECT gps_coordinates, media_owner_id FROM hoardings WHERE id = ?",
      [hoardingId]
    );
    type HoardingRow = {
      gps_coordinates?: string | null;
      media_owner_id?: number | null;
    };
    const hoarding = (hoardingRows as HoardingRow[])[0];

    if (hoarding && hoarding.gps_coordinates) {
      const [hLat, hLng] = hoarding.gps_coordinates.replace(/[^\d.,\-]/g, '').split(',').map(Number);
      if (!isNaN(hLat) && !isNaN(hLng)) {
        const distance = calculateDistance(currentLat, currentLng, hLat, hLng);
        if (distance > 500) {
          return { success: false, error: `Geo-Fence Violation: You are ${Math.round(distance)}m away from the site. Must be within 500 meters.` };
        }
      }
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/audits");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanFileName = photoFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `completion_${assignmentId}_${Date.now()}_${cleanFileName}`;
    await writeFile(path.join(uploadDir, fileName), buffer);
    const photoUrl = `/uploads/audits/${fileName}`;

    await pool.execute(
      `INSERT INTO campaign_completion_reports 
      (assignment_id, auditor_id, hoarding_id, photo_url, light_working, structure_damaged, damage_rating, torn_flex, flex_mounted, obstruction_present, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [assignmentId, auditorId, hoardingId, photoUrl, lightWorking ? 1 : 0, structureDamaged ? 1 : 0, damageRating, tornFlex ? 1 : 0, flexMounted ? 1 : 0, obstructionPresent ? 1 : 0, currentLat || 0, currentLng || 0] as const
    );

    if (structureDamaged || !lightWorking) {
      await pool.execute(
        `INSERT INTO hoarding_alerts (hoarding_id, media_owner_id, alert_type, issue_description, severity) VALUES (?, ?, ?, ?, ?)`,
        [hoardingId, hoarding.media_owner_id || 0, "Post-Campaign Damage", `Damage noted during un-installation. Rating: ${damageRating}.`, damageRating === 'Critical' ? 'Critical' : 'Medium'] as const
      );
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit completion report." };
  }
}