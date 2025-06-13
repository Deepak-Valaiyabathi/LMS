
import { pool } from "../config/db.js";


export const getWeekendAndHolidayCount = (startDate, endDate, holidayList) => {
  try {
    let weekendDays = 0;
  console.log("Start",startDate, "End", endDate, "list", holidayList )
  const start = new Date(startDate);
  const end = new Date(endDate);

  console.log("Start",start, "End", end )

  for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });
    const dateStr = currentDate.toISOString().split('T')[0]; 
    
    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday' || holidayList.includes(dateStr)) {
      weekendDays++;  
      
    }
  }
  console.log(weekendDays)
  return weekendDays;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for utility/leaveCount/getWeekendAndHolidayCount: ${err}`);
  }
};




  export const getHolidayList = async () => {
    try {
      
      const [rows] = await pool.query('SELECT holiday_date FROM HOLIDAYS');
      const holidayDates = rows
      .map(row => {
        const date = new Date(row.holiday_date);
        return isNaN(date) ? null : date.toISOString().split('T')[0];
      })
      .filter(Boolean);
       
      // console.log(rows);
      return holidayDates;
    } catch (error) {
      console.error('Error fetching holidays:', error);
      logger.error(`This is an error message for utility/leaveCount/getHolidayList: ${error}`);
      throw error;
    }
  }



  export const balanceLeaveCheck = async (employee_id, leaveId) => {
    try {
      const query = `
      SELECT total_leave 
      FROM LeaveBalance 
      WHERE employee_id = ? AND leave_type_id = ?
    `;
    const values = [employee_id, leaveId];
  
    const [rows] = await pool.query(query, values);
  
    if (!rows || rows.length === 0) {
      console.warn(`No balance record found for EmployeeId: ${employee_id}, LeaveType: ${leaveId}`);
      return 0;
    } else {
      return rows[0].total_leave;
    }
    } catch (err) {
     console.error(err);
     logger.error(`This is an error message for utility/leaveCount/balanceLeaveCheck: ${err}`);
    }
  };




  

  
  