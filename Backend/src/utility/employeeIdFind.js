import { pool } from "../config/db.js";

export const employeesIdFind = async (managerId, user_employee_id) => {
  try {
    const query = `
    SELECT id
    FROM employee
    WHERE manager_id = ? AND id != ?
  `;
  const [rows] = await pool.query(query, [managerId, user_employee_id]);
console.log("rows", rows)  

    return rows; 
  } catch (err) {
    console.error("Database error:", err);
    logger.error(`This is an error message for utility/employeeIdFind.js/employeesIdFind: ${err}`);
    throw err;
  }
};

export const teamEmployeesIdFind = async (userId) => {
  try {
    const query = `
      SELECT id 
      FROM employee 
      WHERE manager_id = ? OR hr_id = ? OR director_id = ?
    `;
    const [rows] = await pool.query(query, [userId, userId, userId]);
    return rows;
  } catch (err) {
    console.error("teamEmployeesIdFind Error:", err);
    logger.error(`This is an error message for utility/employeeIdFind.js/teamEmployeesIdFind: ${err}`);
    throw err;
  }
};
