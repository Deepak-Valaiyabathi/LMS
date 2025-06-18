import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
const localizer = momentLocalizer(moment);
import 'react-big-calendar/lib/css/react-big-calendar.css';

type LeaveHistoryList = {
    leaveRequestId: number;
    Employee_Id: string;
    Employee_name: string;
    Leave_Type: string;
    Start_Date: string;
    End_Date: string;
    Leave_Count: number;
    Status: number;
  };
  export interface LeaveRequest {
    Start_Date: string;
    End_Date: string;
    Employee_name: string;
    Leave_Type: string;
  }
  
type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: LeaveHistoryList;
  };
function History() {

    const [history, setHistory] =  useState<LeaveHistoryList[]>([]);
    const [show, setShow] = useState(true);

     //style

const styleList = {display: show === true ? "block":"none"}
const styleCalender = {display: show === false ? "block":"none"}

    useEffect(()=>{
        const token = localStorage.getItem("token")!;
        const employee_id = localStorage.getItem("employee_id")!;
        leaveHistory(token, employee_id)
    },[])
    const leaveHistory = async (token:string, employee_id: string) => {
        try {
            const response = await fetch(
              `http://localhost:5000/api/leaves-history/${employee_id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
               
              }
            );
            const result = await response.json();
            if (Array.isArray(result.leavesHistory)) {
                setHistory(
                result.leavesHistory as LeaveHistoryList[]
              );
            } else {
              console.log("Not available", result);
            }
          } catch (err) {
            console.error(err);
          }
    }

  //date format converter
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // calender

  const mapLeaveRequestHistory = (
    history: LeaveRequest[]
  ): CalendarEvent[] => {
  
    let selectedLeaves: LeaveRequest[] = [];
   selectedLeaves = history
  
    // Return the mapped events from the selected list
    return selectedLeaves.map((leave) => {
      const start = new Date(leave.Start_Date);
      const end = new Date(leave.End_Date);
      end.setDate(end.getDate() + 1);
    
      return {
        title: `${leave.Employee_name} - ${leave.Leave_Type}`,
        start,
        end,
        allDay: true,
        resource: leave,
      } as CalendarEvent;
    });
  };
  
  const role = localStorage.getItem("employee_role");

  return (
    <div className="h-screen w-screen bg-white flex px-0 py-0 ">
        <NavBar/>
        <div
        className="mx-0 my-0 h-screen w-[95vw]  px-10 py-5"
        style={{ backgroundColor: "whitesmoke" }}>
          <div className="flex gap-2 justify-between">
          <h1 className="text-black text-[25px] font-semibold">
         History
          </h1>
          <div className="flex gap-2 items-center">
            <button className="bg-[#6a77f9] text-white w-[7vw] cursor-pointer px-2 py-2 rounded-lg text-[17px]" onClick={()=>setShow((prev)=> !prev)}>
              <span>
                <i className="fa-solid fa-list"></i>
              </span>{" "}
              List
            </button>
            <button className="bg-[#6a77f9] text-white w-[7vw] cursor-pointer px-2 py-2 rounded-lg text-[17px]" onClick={()=>setShow((prev)=> !prev)}>
              <span>
                <i className="fa-solid fa-calendar-week"></i>
              </span>{" "}
              Calender
            </button>
          </div>
        </div>
        <div style={styleList}>
       {(role === "Manager" || role === "HR" || role === "Director") ? (
      <div className="overflow-y-auto h-[90vh]" id="mScroll">
          <table className="bg-white shadow-lg w-[90vw] my-2">
        <thead className="bg-[#6a77f9] text-white">
          <tr>
            <th className="text-[17px] font-normal w-35 h-10 border">
              Employee ID
            </th>
            <th className="text-[17px] font-normal w-35 h-10 border">Name</th>
            <th className="text-[17px] font-normal w-35 h-10 border">Type</th>
            <th className="text-[17px] font-normal w-35 h-10 border">
              Start
            </th>
            <th className="text-[17px] font-normal w-35 h-10 border">End</th>
            <th className="text-[17px] font-normal w-35 h-10 border">
              Total Days
            </th>
            <th
              className="text-[17px] font-normal w-35 h-10 border">
               Leave status
            </th>
          </tr>
        </thead>
        <tbody>
  {history.sort((a, b) => b.leaveRequestId - a.leaveRequestId).map((request, index)=>(
  <tr key={index} className="hover:bg-gray-100 transition">
  <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
    {request.Employee_Id}
  </td>
  <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
    {request.Employee_name}
  </td>
  <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
    {request.Leave_Type}
  </td>
  <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
    {formatDate(request.Start_Date)}
  </td>
  <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
    {formatDate(request.End_Date)}
  </td>
  <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
    {request.Leave_Count}
  </td>


  <td
  className={`text-[17px] font-normal px-3 py-2 h-[7vh] ${
    request.Status === 6
      ? "text-green-600"
      : request.Status === 7
      ? "text-red-600"
      : "text-yellow-600"
  }`}
>
  {request.Status === 6 ? "Approved": request.Status=== 7 ? "Cancelled":""}
</td>

    </tr>
  ))}
        </tbody>
      </table>
      </div>
       ):(<></>)}
       </div>
       <div style={styleCalender}>
     <div style={{ height: '500px',marginTop:"30px" }}>
      
<Calendar
  localizer={localizer}
  events={mapLeaveRequestHistory(
    history,
  )}
  startAccessor="start"
  endAccessor="end"
  titleAccessor="title"
  style={{ height: 600 }}
/>
  </div>
</div>
      </div>
    </div>
  )
}

export default History;