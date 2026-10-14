"use server";

import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

interface DashboardStatsRow extends RowDataPacket {
  total_budget: number | null;
  total_hoardings: number;
}

interface SpentStatsRow extends RowDataPacket {
  spent_budget: number | null;
  installed_count: number;
}

interface AssignmentRow extends RowDataPacket {
  [column: string]: unknown;
}

interface ExecutiveRow extends RowDataPacket {
  id: number;
  name: string;
}

interface AssignTaskData {
  auditor_id: number;
  executive_id: number;
  auditor_assignment_id: number;
  deadline: string;
}

export async function getAuditorDashboardStats(auditor_id: number) {
  try {
    const [targetRows] = await pool.execute<DashboardStatsRow[]>(
      "SELECT SUM(installation_budget) as total_budget, COUNT(*) as total_hoardings FROM auditor_assignments WHERE auditor_id = ?",
      [auditor_id]
    );

    const [spentRows] = await pool.execute<SpentStatsRow[]>(
      `SELECT SUM(a.installation_budget) as spent_budget, COUNT(*) as installed_count 
       FROM field_assignments f 
       JOIN auditor_assignments a ON f.auditor_assignment_id = a.id 
       WHERE f.auditor_id = ? AND f.status = 'Approved'`,
      [auditor_id]
    );

    return { 
      success: true, 
      data: {
        total_budget: targetRows[0]?.total_budget || 0,
        total_hoardings: targetRows[0]?.total_hoardings || 0,
        spent_budget: spentRows[0]?.spent_budget || 0,
        installed_count: spentRows[0]?.installed_count || 0
      }
    };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function getMediaOwnerTasks(auditor_id: number) {
  try {
    const [rows] = await pool.execute<AssignmentRow[]>(
      "SELECT * FROM auditor_assignments WHERE auditor_id = ? AND status = 'Pending'",
      [auditor_id]
    );
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getAuditorTasks(auditor_id: number) {
  try {
    const [rows] = await pool.execute<AssignmentRow[]>(
      `SELECT f.*, u.name as executive_name, a.campaign_name, a.location 
       FROM field_assignments f 
       JOIN users u ON f.executive_id = u.id 
       JOIN auditor_assignments a ON f.auditor_assignment_id = a.id
       WHERE f.auditor_id = ? ORDER BY f.created_at DESC`,
      [auditor_id]
    );
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function assignTaskToExecutive(data: AssignTaskData) {
  try {
    const { auditor_id, executive_id, auditor_assignment_id, deadline } = data;
    
    await pool.execute(
      "INSERT INTO field_assignments (auditor_assignment_id, auditor_id, executive_id, deadline) VALUES (?, ?, ?, ?)",
      [auditor_assignment_id, auditor_id, executive_id, deadline]
    );
    
    await pool.execute(
      "UPDATE auditor_assignments SET status = 'Assigned_To_Field' WHERE id = ?",
      [auditor_assignment_id]
    );

    return { success: true, message: "Task successfully assigned to Ground Ops!" };
  } catch (error) {
    return { success: false, message: "Database error while assigning task." };
  }
}

export async function updateTaskStatus(task_id: number, status: string, auditor_assignment_id: number) {
  try {
    await pool.execute("UPDATE field_assignments SET status = ? WHERE id = ?", [status, task_id]);
    
    if (status === 'Approved') {
      await pool.execute("UPDATE auditor_assignments SET status = 'Verified' WHERE id = ?", [auditor_assignment_id]);
    }
    
    return { success: true, message: `Task marked as ${status}` };
  } catch (error) {
    return { success: false, message: "Status update failed." };
  }
}

export async function getAuditorExecutives(auditor_id: number) {
  try {
    const [rows] = await pool.execute<ExecutiveRow[]>(
      "SELECT id, name FROM users WHERE role = 'FIELD_EXECUTIVE' AND auditor_id = ?",
      [auditor_id]
    );
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, data: [] };
  }
}