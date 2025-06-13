import { pool } from "../config/db.js";

export const employeeLeaveBalance = async (EmployeeId, leaveCount, leaveType) => {
  try {
    leaveCount = Number(leaveCount);

    if (isNaN(leaveCount) || leaveCount <= 0) {
      throw new Error('Invalid leaveCount input');
    }

    if (!EmployeeId || typeof EmployeeId !== 'string') {
      throw new Error('Invalid EmployeeId input');
    }

    console.log("Updating with values:", { EmployeeId, leaveCount, leaveType });

    const query = `
      UPDATE LeaveBalance 
      SET total_leave = total_leave - ?, leave_taken = leave_taken + ?
      WHERE employee_id = ? AND leave_type_id = ?
    `;

    const values = [leaveCount, leaveCount, EmployeeId, leaveType];
    const [result] = await pool.query(query, values);

    console.log("Leave balance update result:", result);
    return { success: true, result };
  } catch (err) {
    console.error("Update Error:", err.message);
    logger.error(`This is an error message for utility/employeeLeaveBalance: ${ err.message}`);

    return { success: false, error: err.message };
  }
};

