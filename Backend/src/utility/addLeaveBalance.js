import { pool } from "../config/db.js";

export const addLeaveBalance = async (employee_id, Role_id) => {
  const currentYear = new Date().getFullYear();

  try {
    const policyQuery = `
      SELECT accrual_per_month, leave_type_id, max_days_per_year 
      FROM LeavePolicy 
      WHERE employee_type_id = ?
    `;
    const [rows] = await pool.query(policyQuery, [Role_id]);

    const insertQuery = `
      INSERT INTO LeaveBalance 
      (employee_id, leave_type_id, year, total_leave, leave_taken) 
      VALUES (?, ?, ?, ?, 0)
    `;

    for (const data of rows) {
      const totalLeave =
        data.accrual_per_month === 0
          ? data.max_days_per_year
          : data.accrual_per_month;

      const values = [
        employee_id,
        data.leave_type_id,
        currentYear,
        totalLeave,
      ];

      await pool.query(insertQuery, values);
    }

    return "worked";
  } catch (err) {
    console.error("Error adding leave balance:", err);
    logger.error(`This is an error message for utility/addLeaveBalance: ${err}`);
    throw err;
  }
};
