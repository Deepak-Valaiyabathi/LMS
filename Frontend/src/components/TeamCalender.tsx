import { useState, useEffect } from "react";

type LeaveEntry = {
  start_date: string;
  end_date: string;
};

type LeaveTypes = {
  Sick: LeaveEntry[];
  Casual: LeaveEntry[];
  Planned: LeaveEntry[];
};

type GroupedTeamLeaves = {
  [name: string]: LeaveTypes;
} | { message: string };

type HolidayByType = {
  floater:{ date: string; name: string }[];
  public: { date: string; name: string }[];
  national: { date: string; name: string }[];
  [key: string]: any; 
};



function TeamCalender() {
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [dayNamesInMonth, setDayNamesInMonth] = useState<string[]>([]);
  const [teamLeaveDate, setTeamLeaveDate] = useState<GroupedTeamLeaves>({});

  
  const [selectedMonth, setSelectedMonth] = useState<number>(5); 
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const handlePrevMonth = () => {
    setSelectedMonth((prev) => {
      if (prev === 0) {
        setSelectedYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      if (prev === 11) {
        setSelectedYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };


  const generateDatesAndDays = (monthIndex: number, year: number) => {
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dates: number[] = [];
    const days: string[] = [];

    for (let day = 1; day <= lastDay; day++) {
      const dateObj = new Date(year, monthIndex, day);
      dates.push(day);
      days.push(dayNames[dateObj.getDay()]);
    }

    setDaysInMonth(dates);
    setDayNamesInMonth(days);
  };

  const teamMembersLeaveDate = async (token: string, manager_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/team-members/leaves-dates/${manager_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

        }
      );

      const result = await response.json();
      if (result && typeof result === "object") {
        setTeamLeaveDate(result);
        console.log("Leave data:", result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // holiday
  const [holidayList, setHolidayList] = useState<HolidayByType>({
    floater: [],
    public: [],
    national: []
  });
  
  const fetchHolidays = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/holidaysShow', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      const result = await response.json();
     console.log(result,"holiday")
      setHolidayList(result);
      
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };
console.log(holidayList)

  useEffect(() => {
    generateDatesAndDays(selectedMonth, selectedYear);
    fetchHolidays( localStorage.getItem("token")!)
    console.log(selectedMonth, selectedYear)
    
    const token = localStorage.getItem("token");
 
    const managerId = localStorage.getItem("manager_id");
    
    if (!token) {
      console.error("Missing token");
      return;
    }
 
    const manager_id_to_send = managerId;
   
    if (!manager_id_to_send) {
      console.error("Missing manager_id to send to backend.");
      return;
    }
  
    
    teamMembersLeaveDate(token, manager_id_to_send);
    
   
  }, [selectedMonth, selectedYear]);

  return (
    <div className="bg-white border border-gray-300 rounded-md mt-6 w-[90vw] mx-auto shadow-sm">
      <div className="border-b border-gray-300 flex items-center justify-between p-3 bg-gray-50">
        <div className="flex items-center gap-2 w-[17vw]">
        <button
        className="bg-blue-500 text-white px-2 py-1 cursor-pointer rounded hover:bg-blue-600"
        onClick={handlePrevMonth}
      >
        {`<`}
      </button>
      <span className="text-lg font-medium text-gray-700">
        {monthNames[selectedMonth]} {selectedYear}
      </span>
      <button
        className="bg-blue-500 text-white px-2 py-1 cursor-pointer rounded hover:bg-blue-600"
        onClick={handleNextMonth}
      >
        {`>`}
      </button>

        </div>
        <div className="flex gap-2 text-gray-700 w-[73vw] justify-end">
          {dayNamesInMonth.map((name, idx) => (
            <div key={idx} className="w-8 text-center text-sm font-medium">
              {name}
            </div>
          ))}
        </div>
      </div>

      {("message" in teamLeaveDate) ? (
<div>
<div className="flex">
        <div className="w-[16vw] text-[14px]  font-medium px-2 text-gray-800">
        Nobody is on leave for the selected month
       </div>
  <div className="flex w-[73vw] text-gray-600 text-md">
  
  {daysInMonth.map((day, i) => {
  const currentDate = new Date(selectedYear, selectedMonth, day);

  const isFloaterHoliday = holidayList.floater.some((holiday) => {
    const holidayDateStr = new Date(holiday.date).toDateString();
    return holidayDateStr === currentDate.toDateString();
  });

  const isPublicHoliday = holidayList.public.some((holiday) => {
    const holidayDateStr = new Date(holiday.date).toDateString();
    return holidayDateStr === currentDate.toDateString();
  });

  const isNationalHoliday = holidayList.national.some((holiday) => {
    const holidayDateStr = new Date(holiday.date).toDateString();
    return holidayDateStr === currentDate.toDateString();
  });

  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

  return (
    <div key={i} className="w-10 h-8 flex items-center justify-center">
      <span
        className={`w-7 text-center m-0 rounded-xl
          ${isFloaterHoliday ? "bg-[#4ED7F1] text-white font-semibold" : ""}
          ${isPublicHoliday ? "bg-[#FE5D26] text-white font-semibold" : ""}
          ${isNationalHoliday ? "bg-[#FE5D26] text-white font-semibold" : ""}
          ${isWeekend ? "bg-[#4300FF] text-white font-semibold" : ""}
        `}
      >
        {day}
      </span>
    </div>
  );
})}

  </div>
  
  </div>
  <div className="bg-gray-200 h-10 flex items-center justify-center gap-10 mt-3">
      <div className="flex items-center gap-2">
        <div className="bg-pink-500 rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Sick Leave</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-green-500 rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Planned Leave</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-yellow-500 rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Casual Leave</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-[#4ED7F1] rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Floater</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-[#FE5D26] rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Holiday</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-[#4300FF] rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Week End</h1>
      </div>
    </div>
</div>
) : (
  <div className="divide-y divide-gray-200">
    {Object.entries(teamLeaveDate).map(([name, leaveTypes], index) => {
      const allLeaves = Object.entries(leaveTypes).flatMap(
        ([type, leaves]) =>
          leaves.map(leave => ({
            ...leave,
            type,
          }))
      );
console.log(allLeaves);

      return (
        <div
          key={index}
          className="flex items-center justify-between py-2 px-3"
        >
          <div className="w-[17vw] font-medium text-gray-800">{name}</div>

          <div className="flex w-[73vw] text-gray-600 text-md">
            {daysInMonth.map((day, i) => {
              const currentDate = new Date(selectedYear, selectedMonth, day);

              const leave = allLeaves.find(({ start_date, end_date }) => {
                const leaveStart = new Date(start_date);
                const leaveEnd = new Date(end_date);
                return currentDate >= leaveStart && currentDate <= leaveEnd;
              });

              const isStartOrEndDate =
                leave &&
                (new Date(leave.start_date).toDateString() ===
                  currentDate.toDateString() ||
                  new Date(leave.end_date).toDateString() ===
                    currentDate.toDateString());

                    const isFloaterHoliday = holidayList.floater.some((holiday) => {
                      const holidayDateStr = new Date(holiday.date).toDateString();
                      return holidayDateStr === currentDate.toDateString();
                    });

                    const isPublicHoliday = holidayList.public.some((holiday) => {
                      const holidayDateStr = new Date(holiday.date).toDateString();
                      return holidayDateStr === currentDate.toDateString();
                    });

                    const isNationalHoliday = holidayList.national.some((holiday) => {
                      const holidayDateStr = new Date(holiday.date).toDateString();
                      return holidayDateStr === currentDate.toDateString();
                    });

              const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

             
              const leaveColor =
                leave?.type === "casual"
                  ? "bg-[#F4F8D3]"
                  : leave?.type === "planned"
                  ? "bg-[#A6D6D6]"
                  : leave?.type === "sick"
                  ? "bg-[#F7CFD8]"
                  : "bg-gray-200";

              const spanColor =
                leave?.type === "casual"
                  ? "bg-yellow-500"
                  : leave?.type === "planned"
                  ? "bg-green-500"
                  : leave?.type === "sick"
                  ? "bg-pink-500"
                  : "";

              return (
                <div
                  key={i}
                  className={`w-10 h-8 flex items-center justify-center
                    ${leave ? `${leaveColor} text-black font-bold` : "bg-gray-200"} 
                    ${i === 0 ? "rounded-l-full px-0" : ""} 
                    ${i === daysInMonth.length - 1 ? "rounded-r-full px-0" : ""}
                  `}
                >
                  <span
                    className={`w-7 text-center m-0 rounded-xl
                      ${isFloaterHoliday ? "bg-[#4ED7F1] text-white font-semibold" : ""}
                      ${isPublicHoliday ? "bg-[#FE5D26] text-white font-semibold" : ""}
                      ${isNationalHoliday ? "bg-[#FE5D26] text-white font-semibold" : ""}
                      ${isStartOrEndDate ? `${spanColor} text-white` : ""}
                      ${isWeekend ? "bg-[#4300FF] text-white font-semibold" : ""}
                    `}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}

  
    <div className="bg-gray-200 h-10 flex items-center justify-center gap-10 mt-3">
      <div className="flex items-center gap-2">
        <div className="bg-pink-500 rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Sick Leave</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-green-500 rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Planned Leave</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-yellow-500 rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Casual Leave</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-[#4ED7F1] rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Floater</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-[#FE5D26] rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Holiday</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-[#4300FF] rounded-full h-5 w-5"></div>
        <h1 className="text-[17px]">Week End</h1>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default TeamCalender;
