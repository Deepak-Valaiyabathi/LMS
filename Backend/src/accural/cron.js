import cron from "node-cron";
import { pool } from "../config/db.js";

// month accural
cron.schedule("0 3 1 * *", async () => {
  try {
    await pool.query(`  SET SQL_SAFE_UPDATES = 0`);

    await pool.query(`UPDATE LeaveBalance lb
    JOIN LeaveType lt ON lt.id = lb.leave_type_id
    JOIN LeavePolicy lp ON lp.leave_type_id = lb.leave_type_id
    JOIN EmployeeType et ON et.id = lp.employee_type_id
    JOIN Employee e ON e.emp_type_id = et.id AND lb.employee_id = e.id
    SET lb.total_leave = lb.total_leave + lp.accrual_per_month where lb.leave_type_id != 4`);

    // await pool.query(`UPDATE LeavePolicy SET max_days_per_year = max_days_per_year - accrual_per_month`);

    const [row] = await pool.query(`SET SQL_SAFE_UPDATES = 1`);
    if (row.affectedRows > 0) {
      console.log("worked");
    }
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for accural/month accural/cron: ${err}`);

  }
});

// year accural

cron.schedule("0 0 1 1 *", async () => {
  try {
    const [row] = await pool.query(`
        UPDATE leavebalance lb
JOIN leavetype lt ON lb.leave_type_id = lt.id
SET lb.total_leave = CASE
    WHEN lt.carry_forword = 'no' THEN 0
    ELSE lb.total_leave
END
   `);
    if (row.affectedRows > 0) {
      console.log("worked");
    }
  } catch (error) {
    console.error(err);
    logger.error(`This is an error message for accural/year accural/cron: ${err}`);
  }
});
