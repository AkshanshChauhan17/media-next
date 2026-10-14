"use server";

import pool from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

export async function getKYCStatus() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      "SELECT status FROM media_owner_kyc WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    const kyc = (rows as Array<{ status: string }>)[0];
    return { success: true, status: kyc ? kyc.status : null };
  } catch (error) {
    return { success: false, error: "Failed to fetch KYC status" };
  }
}

export async function submitKYC(formData: FormData) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const businessName = formData.get("businessName") as string;
    const businessType = formData.get("businessType") as string;
    const incorporationDate = formData.get("incorporationDate") as string;
    const gstin = formData.get("gstin") as string;
    const pan = formData.get("pan") as string;
    const address = formData.get("address") as string;
    const accountName = formData.get("accountName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const ifsc = formData.get("ifsc") as string;
    const bankName = formData.get("bankName") as string;
    const phone = formData.get("phone") as string;

    const gstFile = formData.get("gstFile") as File;
    const panFile = formData.get("panFile") as File;
    const chequeFile = formData.get("chequeFile") as File;

    if (!businessName || !gstin || !pan || !gstFile || !panFile || !chequeFile || !phone) {
      return { success: false, error: "Missing required fields or files." };
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/kyc");
    await mkdir(uploadDir, { recursive: true });

    const saveFile = async (file: File, prefix: string) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${prefix}_${Date.now()}_${cleanFileName}`;
      const filePath = path.join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      return `/uploads/kyc/${fileName}`;
    };

    const gstUrl = await saveFile(gstFile, `gst_${userId}`);
    const panUrl = await saveFile(panFile, `pan_${userId}`);
    const chequeUrl = await saveFile(chequeFile, `cheque_${userId}`);

    // Get a connection from the pool to use transactions
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Update the phone number and kyc_status in the users table
      await connection.execute(
        `UPDATE users SET phone = ?, kyc_status = 'Pending' WHERE id = ?`,
        [phone, userId]
      );

      // 2. Insert or Update KYC details in media_owner_kyc table
      // If the user already submitted KYC (e.g., it was rejected and they are resubmitting),
      // we update the existing record instead of throwing a duplicate key error.
      // Make sure 'user_id' is a UNIQUE key in your media_owner_kyc table for this to work perfectly.
      await connection.execute(
        `INSERT INTO media_owner_kyc 
        (user_id, business_name, business_type, incorporation_date, gstin, pan, address, account_name, account_number, ifsc, bank_name, gst_file_url, pan_file_url, cheque_file_url, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        ON DUPLICATE KEY UPDATE 
        business_name = VALUES(business_name),
        business_type = VALUES(business_type),
        incorporation_date = VALUES(incorporation_date),
        gstin = VALUES(gstin),
        pan = VALUES(pan),
        address = VALUES(address),
        account_name = VALUES(account_name),
        account_number = VALUES(account_number),
        ifsc = VALUES(ifsc),
        bank_name = VALUES(bank_name),
        gst_file_url = VALUES(gst_file_url),
        pan_file_url = VALUES(pan_file_url),
        cheque_file_url = VALUES(cheque_file_url),
        status = 'Pending'`,
        [userId, businessName, businessType, incorporationDate, gstin, pan, address, accountName, accountNumber, ifsc, bankName, gstUrl, panUrl, chequeUrl]
      );

      await connection.commit();
      return { success: true };
    } catch (transactionError) {
      await connection.rollback();
      throw transactionError; // Re-throw to be caught by outer catch
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("KYC Submit Error:", error);
    return { success: false, error: "Failed to submit KYC" };
  }
}

export async function getHoardings() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      "SELECT * FROM hoardings WHERE media_owner_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch hoardings" };
  }
}

export async function addHoarding(formData: FormData) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const hoardingId = formData.get("hoardingId") as string;
    const location = formData.get("location") as string;
    const gpsCoordinates = formData.get("gpsCoordinates") as string;
    const size = formData.get("size") as string;
    const dailyTraffic = parseInt(formData.get("dailyTraffic") as string, 10);
    const demandCategory = formData.get("demandCategory") as string;
    const status = formData.get("status") as string;
    const availableFrom = formData.get("availableFrom") as string || null;

    if (!hoardingId || !location || !gpsCoordinates || !size) {
      return { success: false, error: "Please fill all required fields." };
    }

    await pool.execute(
      `INSERT INTO hoardings 
      (media_owner_id, hoarding_id_string, location, gps_coordinates, size, daily_traffic, demand_category, status, available_from) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, hoardingId, location, gpsCoordinates, size, dailyTraffic, demandCategory, status, availableFrom]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add hoarding" };
  }
}

export async function getBookings() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT b.*, h.hoarding_id_string, h.location, h.size 
       FROM bookings b 
       JOIN hoardings h ON b.hoarding_id = h.id 
       WHERE h.media_owner_id = ? 
       ORDER BY b.created_at DESC`,
      [userId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch bookings" };
  }
}

export async function updateBookingStatus(bookingId: number, status: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT b.id FROM bookings b 
       JOIN hoardings h ON b.hoarding_id = h.id 
       WHERE b.id = ? AND h.media_owner_id = ?`,
      [bookingId, userId]
    );

    if ((rows as Array<{ id: number }>).length === 0) {
      return { success: false, error: "Booking not found or unauthorized" };
    }

    await pool.execute(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, bookingId]
    );

    if (status === 'Accepted') {
      await pool.execute(
        `UPDATE hoardings h 
         JOIN bookings b ON h.id = b.hoarding_id 
         SET h.status = 'Occupied', h.available_from = b.end_date 
         WHERE b.id = ?`,
        [bookingId]
      );
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update booking status" };
  }
}

export async function getUpcomingVacancies() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT b.id as booking_id, b.advertiser_name, b.campaign_name, b.start_date, b.end_date, 
              h.hoarding_id_string, h.location, h.size, h.id as hoarding_id
       FROM bookings b 
       JOIN hoardings h ON b.hoarding_id = h.id 
       WHERE h.media_owner_id = ? AND b.status = 'Accepted' AND b.end_date >= CURRENT_DATE
       ORDER BY b.end_date ASC`,
      [userId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch upcoming vacancies" };
  }
}

export async function getPaymentAnalytics() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [paymentRows] = await pool.execute(
      `SELECT p.*, b.advertiser_name, b.campaign_name, h.hoarding_id_string, h.location 
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN hoardings h ON b.hoarding_id = h.id
       WHERE p.media_owner_id = ?
       ORDER BY p.due_date ASC`,
      [userId]
    );

    const [statsRows] = await pool.execute(
      `SELECT 
        COALESCE(SUM(amount), 0) as total_booked_month,
        COALESCE(SUM(paid_amount), 0) as collected_month,
        COALESCE(SUM(amount - paid_amount), 0) as pending_month
       FROM payments 
       WHERE media_owner_id = ? 
         AND MONTH(due_date) = MONTH(CURRENT_DATE) 
         AND YEAR(due_date) = YEAR(CURRENT_DATE)`,
      [userId]
    );

    const [predictionRows] = await pool.execute(
      `SELECT COALESCE(SUM(amount), 0) as projected_next_month 
       FROM payments 
       WHERE media_owner_id = ? 
         AND MONTH(due_date) = MONTH(DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH))
         AND YEAR(due_date) = YEAR(DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH))`,
      [userId]
    );

    const stats = (statsRows as Record<string, number>[])[0] || { total_booked_month: 0, collected_month: 0, pending_month: 0 };
    const prediction = (predictionRows as Record<string, number>[])[0] || { projected_next_month: 0 };

    return {
      success: true,
      data: {
        payments: paymentRows,
        metrics: {
          bookedThisMonth: Number(stats.total_booked_month),
          collectedThisMonth: Number(stats.collected_month),
          pendingThisMonth: Number(stats.pending_month),
          expectedNextMonth: Number(prediction.projected_next_month) || (Number(stats.total_booked_month) * 1.15)
        }
      }
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch payment analytics" };
  }
}

export async function recordPaymentEntry(
  paymentId: number, 
  amountPaid: number, 
  paymentMethod: string, 
  transactionId: string
) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      "SELECT amount, paid_amount FROM payments WHERE id = ? AND media_owner_id = ?",
      [paymentId, userId]
    );

    const payment = (rows as Array<{ amount: number; paid_amount: number }>)[0];
    if (!payment) return { success: false, error: "Payment record not found" };

    const newPaidAmount = Number(payment.paid_amount) + amountPaid;
    const newStatus = newPaidAmount >= Number(payment.amount) ? 'Paid' : 'Partially Paid';

    await pool.execute(
      `UPDATE payments 
       SET paid_amount = ?, status = ?, payment_method = ?, transaction_id = ?, payment_date = CURRENT_DATE 
       WHERE id = ?`,
      [newPaidAmount, newStatus, paymentMethod, transactionId, paymentId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to record payment" };
  }
}

export async function getInstallationTasks() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Fetch accepted bookings that need installation reports (Left join to check status)
    const [rows] = await pool.execute(
      `SELECT b.id as booking_id, b.advertiser_name, b.campaign_name, b.start_date, 
              h.hoarding_id_string, h.location,
              ir.id as report_id, ir.status as report_status
       FROM bookings b 
       JOIN hoardings h ON b.hoarding_id = h.id 
       LEFT JOIN installation_reports ir ON b.id = ir.booking_id
       WHERE h.media_owner_id = ? AND b.status = 'Accepted'
       ORDER BY b.start_date ASC`,
      [userId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch installation tasks" };
  }
}

export async function submitInstallationReport(formData: FormData) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const bookingId = parseInt(formData.get("bookingId") as string, 10);
    const flexMounted = formData.get("flexMounted") === "true" ? 1 : 0;
    const lightingWorking = formData.get("lightingWorking") === "true" ? 1 : 0;
    const damageStatus = formData.get("damageStatus") as string;
    const obstructionPresent = formData.get("obstructionPresent") === "true" ? 1 : 0;
    const photoFile = formData.get("photoFile") as File;

    if (!photoFile || photoFile.size === 0) {
      return { success: false, error: "Installation photo is mandatory. Cannot submit without proof." };
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/installations");
    await mkdir(uploadDir, { recursive: true });

    const cleanFileName = photoFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `install_${bookingId}_${Date.now()}_${cleanFileName}`;
    const filePath = path.join(uploadDir, fileName);
    
    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    const photoUrl = `/uploads/installations/${fileName}`;

    await pool.execute(
      `INSERT INTO installation_reports 
      (booking_id, media_owner_id, flex_mounted, lighting_working, damage_status, obstruction_present, photo_url, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending Review')`,
      [bookingId, userId, flexMounted, lightingWorking, damageStatus, obstructionPresent, photoUrl]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit installation report" };
  }
}

export async function getHoardingAlerts() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT a.*, h.hoarding_id_string, h.location 
       FROM hoarding_alerts a
       JOIN hoardings h ON a.hoarding_id = h.id
       WHERE a.media_owner_id = ? AND a.is_resolved = FALSE
       ORDER BY 
         CASE a.severity 
           WHEN 'Critical' THEN 1 
           WHEN 'Medium' THEN 2 
           WHEN 'Minor' THEN 3 
         END, 
         a.created_at DESC`,
      [userId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch alerts" };
  }
}

export async function resolveAlert(alertId: number) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Ensure the user owns this alert before resolving
    await pool.execute(
      "UPDATE hoarding_alerts SET is_resolved = TRUE WHERE id = ? AND media_owner_id = ?",
      [alertId, userId]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to resolve alert" };
  }
}

export async function createTestAlert(hoardingId: number, type: string, desc: string, severity: string) {
    try {
        const userId = await getUserId();
        if (!userId) return { success: false };
        await pool.execute(
            `INSERT INTO hoarding_alerts (hoarding_id, media_owner_id, alert_type, issue_description, severity) 
             VALUES (?, ?, ?, ?, ?)`,
            [hoardingId, userId, type, desc, severity]
        );
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function getAuditorsList() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT id, name, email, city 
       FROM users 
       WHERE role = 'AUDITOR' 
       ORDER BY name ASC`
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch auditors" };
  }
}

export async function getCampaignProofs() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT 
        b.id as booking_id, 
        b.campaign_name, 
        b.advertiser_name,
        h.hoarding_id_string, 
        h.location,
        ir.photo_url as after_photo,
        (SELECT photo_url FROM audit_reports ar WHERE ar.hoarding_id = h.id ORDER BY ar.created_at DESC LIMIT 1) as before_photo
       FROM bookings b
       JOIN hoardings h ON b.hoarding_id = h.id
       LEFT JOIN installation_reports ir ON b.id = ir.booking_id
       WHERE h.media_owner_id = ? AND b.status = 'Accepted'
       ORDER BY b.start_date DESC`,
      [userId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch campaign proofs" };
  }
}

// Fetch active campaigns of the media owner that DO NOT have an auditor assigned yet
export async function getUnassignedCampaigns() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [rows] = await pool.execute(
      `SELECT b.id as booking_id, b.campaign_name, h.id as hoarding_id, h.hoarding_id_string, h.location
       FROM bookings b
       JOIN hoardings h ON b.hoarding_id = h.id
       LEFT JOIN auditor_assignments aa ON b.id = aa.booking_id
       WHERE h.media_owner_id = ? AND b.status IN ('Accepted', 'Active') AND aa.id IS NULL`,
      [userId]
    );

    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: "Failed to fetch unassigned campaigns" };
  }
}

export async function assignAuditorToCampaign(bookingId: number, hoardingId: number, auditorId: number) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const [check] = await pool.execute(
      "SELECT id FROM hoardings WHERE id = ? AND media_owner_id = ?",
      [hoardingId, userId]
    );

    if (!Array.isArray(check) || check.length === 0) {
      return { success: false, error: "Invalid hoarding access." };
    }
    
    await pool.execute(
      "INSERT INTO auditor_assignments (booking_id, hoarding_id, auditor_id, status) VALUES (?, ?, ?, 'Assigned')",
      [bookingId, hoardingId, auditorId]
    );

    return { success: true };
  } catch (error) {
    console.error("Assignment Error:", error);
    return { success: false, error: "Failed to assign auditor" };
  }
}

export async function updateHoarding(id: string | number, formData: FormData) {
  try {
    const size = formData.get("size");
    const location = formData.get("location");
    const city = formData.get("city");
    const gpsCoordinates = formData.get("gpsCoordinates");
    const mediaType = formData.get("mediaType");
    const basePrice = formData.get("basePrice");
    const dailyTraffic = formData.get("dailyTraffic");
    const demandCategory = formData.get("demandCategory");
    const status = formData.get("status");
    const availableFrom = formData.get("availableFrom") || null;

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const saveFile = async (file: File | null) => {
      if (!file || file.size === 0 || file.name === 'undefined') return null;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      return `/uploads/${filename}`;
    };

    const mainImage = await saveFile(formData.get("mainImage") as File);
    const pano1 = await saveFile(formData.get("panoImage0") as File);
    const pano2 = await saveFile(formData.get("panoImage1") as File);
    const pano3 = await saveFile(formData.get("panoImage2") as File);
    const pano4 = await saveFile(formData.get("panoImage3") as File);
    const pano5 = await saveFile(formData.get("panoImage4") as File);

    let updateQuery = `UPDATE hoardings SET size = ?, location = ?, city = ?, gps_coordinates = ?, media_type = ?, base_price = ?, daily_traffic = ?, demand_category = ?, status = ?, available_from = ?`;
    
    const queryParams: (string | number | null)[] = [
      String(size || ''), String(location || ''), String(city || ''), String(gpsCoordinates || ''), String(mediaType || ''), String(basePrice || ''), String(dailyTraffic || ''), String(demandCategory || ''), String(status || ''), availableFrom ? String(availableFrom) : null
    ];

    if (mainImage) { updateQuery += `, image_url = ?`; queryParams.push(mainImage); }
    if (pano1) { updateQuery += `, pano_image_1 = ?`; queryParams.push(pano1); }
    if (pano2) { updateQuery += `, pano_image_2 = ?`; queryParams.push(pano2); }
    if (pano3) { updateQuery += `, pano_image_3 = ?`; queryParams.push(pano3); }
    if (pano4) { updateQuery += `, pano_image_4 = ?`; queryParams.push(pano4); }
    if (pano5) { updateQuery += `, pano_image_5 = ?`; queryParams.push(pano5); }

    updateQuery += ` WHERE id = ?`;
    queryParams.push(id);

    await pool.execute(updateQuery, queryParams);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update hoarding" };
  }
}