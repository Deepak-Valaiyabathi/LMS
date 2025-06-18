import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

type LeaveRequestListManager = {
  LeaveRequestId: number;
  Employee_Id: string;
  Employee_name: string;
  Leave_Type: string;
  leave_Type_ID: number;
  Start_Date: string;
  End_Date: string;
  Leave_Count: number;
  Reason: string;
  Status: number;
};

type LeaveRequestListHR = {
  LeaveRequestId: number;
  Employee_Id: string;
  Employee_name: string;
  Leave_Type: string;
  leave_Type_ID: number;
  Start_Date: string;
  End_Date: string;
  Leave_Count: number;
  Reason: string;
  Status: number;
};

type LeaveRequestListDirector = {
  LeaveRequestId: number;
  Employee_Id: string;
  Employee_name: string;
  Leave_Type: string;
  leave_Type_ID: number;
  Start_Date: string;
  End_Date: string;
  Leave_Count: number;
  Reason: string;
  Status: number;
};

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: LeaveRequestListManager;
};

export interface LeaveRequest {
  Start_Date: string;
  End_Date: string;
  Employee_name: string;
  Leave_Type: string;
}

export interface leaveApprovalParameter {
  changeStatus: number,
  Employee_Id: string,
  LeaveRequestId: number,
  Leave_Count: number,
  leave_Type_ID: number
}



function LeaveList() {
  const navigate = useNavigate();
 
  const [leaveRequestListManager, setLeaveRequestListManager] = useState<
    LeaveRequestListManager[]
  >([]);
  const [leaveRequestListHR, setLeaveRequestListHR] = useState<
    LeaveRequestListHR[]
  >([]);
  const [leaveRequestListDirector, setLeaveRequestListDirector] = useState<
    LeaveRequestListDirector[]
  >([]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    localStorage.setItem("page", "home");
    const token = localStorage.getItem("token")!;
    const employee_id = localStorage.getItem("employee_id")!;
    // const employee_role = localStorage.getItem("employee_role")
    if (token && employee_id) {
      if (localStorage.getItem("employee_role") === "Manager") {
        requestListManager(token, employee_id);
      } else if (localStorage.getItem("employee_role") === "HR") {
        requestListHR(token, employee_id);
      } else if (localStorage.getItem("employee_role") === "Director") {
        requestListDirector(token, employee_id);
      }
    }
  }, []);

  const [commentForm, setCommentForm] = useState<string>("not");
  const [comment, setComment] = useState<string>("");

  const [defaultValue, setDefaultValue] = useState<leaveApprovalParameter>({
    changeStatus: 1,
    Employee_Id: "EMP001",
    LeaveRequestId: 101,
    Leave_Count: 2,
    leave_Type_ID: 3,
  });

  const commentStyle: React.CSSProperties = {
    pointerEvents: commentForm === "pop" ? "none" : "auto",
    opacity: commentForm === "pop" ? 0.5 : 1,
  };

  const leaveRequestChange = (params: leaveApprovalParameter) => {
    const {
      changeStatus,
      Employee_Id,
      LeaveRequestId,
      Leave_Count,
      leave_Type_ID,
    } = params;

    const role = localStorage.getItem("employee_role");

    if (role === "Manager") {
      ManagerChangeStatus(changeStatus, LeaveRequestId, comment);
    } else if (role === "HR") {
      HRChangeStatus(
        changeStatus,
        Employee_Id,
        LeaveRequestId,
        Leave_Count,
        leave_Type_ID,
        comment
      );
    } else if (role === "Director") {
      DirectorChangeStatus(
        changeStatus,
        Employee_Id,
        LeaveRequestId,
        Leave_Count,
        leave_Type_ID,
        comment
      );
    }

    setCommentForm("not");
  };

  // ✅ Correct place to handle the "open" trigger
  useEffect(() => {
    if (commentForm === "open") {
      leaveRequestChange(defaultValue);
    }
  }, [commentForm]);
  // manager see the leave request
  const requestListManager = async (token: string, employee_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-request/manager/${employee_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (Array.isArray(result.leaveRequestForManager)) {
        setLeaveRequestListManager(
          result.leaveRequestForManager as LeaveRequestListManager[]
        );
      } else {
        console.log("Not available", result);
      }
    } catch (err) {
      console.error(err);
    }
  };
  // Manager Approved or Cancel the request

  const ManagerChangeStatus = async (
    changeStatus: number,
    LeaveRequestId: number,
    comment: string
  ) => {
    const token = localStorage.getItem("token")!;
    const employee_id = localStorage.getItem("employee_id")!;
    console.log("mr");
    try {
      const response = await fetch(
        "http://localhost:5000/api/leave-request/manager-update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LeaveRequestId,
            employee_id,
            changeStatus,
            comment,
          }),
          credentials: "include",
        }
      );
      const result = await response.json();
      console.log(result.message);
      if (result.message === "Successfully updated") {
        window.location.reload();
      } else {
        console.log(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // HR see the leave request
  const requestListHR = async (token: string, employee_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-request/HR/${employee_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (Array.isArray(result.leaveRequestForHR)) {
        setLeaveRequestListHR(result.leaveRequestForHR as LeaveRequestListHR[]);
      } else {
        console.log("Not available", result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // HR Approved or Cancel the request

  const HRChangeStatus = async (
    changeStatus: number,
    Employee_Id: string,
    LeaveRequestId: number,
    Leave_Count: number,
    leave_Type_ID: number,
    comment: string
  ) => {
    const token = localStorage.getItem("token")!;
    const employee_id = localStorage.getItem("employee_id")!;
    try {
      const response = await fetch(
        "http://localhost:5000/api/leave-request/hr-update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LeaveRequestId,
            employee_id,
            changeStatus,
            Leave_Count,
            leave_Type_ID,
            Employee_Id,
            comment,
          }),
          credentials: "include",
        }
      );
      const result = await response.json();
      console.log(result.message);
      if (result.message === "Successfully updated") {
        window.location.reload();
      } else {
        console.log(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // director see the leave request
  const requestListDirector = async (token: string, employee_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-request/Director/${employee_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
       
        }
      );
      const result = await response.json();
      if (Array.isArray(result.leaveRequestForDirector)) {
        setLeaveRequestListDirector(
          result.leaveRequestForDirector as LeaveRequestListDirector[]
        );
      } else {
        console.log("Not available", result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Director Approved or Cancel the request

  const DirectorChangeStatus = async (
    changeStatus: number,
    Employee_Id: string,
    LeaveRequestId: number,
    Leave_Count: number,
    leave_Type_ID: number,
    comment: string
  ) => {
    const token = localStorage.getItem("token")!;
    const employee_id = localStorage.getItem("employee_id")!;

    try {
      const response = await fetch(
        "http://localhost:5000/api/leave-request/director-update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LeaveRequestId,
            employee_id,
            changeStatus,
            Leave_Count,
            leave_Type_ID,
            Employee_Id,
            comment,
          }),
          credentials: "include",
        }
      );
      const result = await response.json();
      console.log(result.message);
      if (result.message === "Successfully updated") {
        window.location.reload();
      } else {
        console.log(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Status check function

  //date format converter
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // calender

  const mapLeaveRequestsToEvents = (
    leaveRequestListManager: LeaveRequest[],
    leaveRequestListHR: LeaveRequest[],
    leaveRequestListDirector: LeaveRequest[]
  ): CalendarEvent[] => {
    const role = localStorage.getItem("employee_role");

    let selectedLeaves: LeaveRequest[] = [];

    if (role === "Manager") {
      selectedLeaves = leaveRequestListManager;
    } else if (role === "HR") {
      selectedLeaves = leaveRequestListHR;
    } else if (role === "Director") {
      selectedLeaves = leaveRequestListDirector;
    }

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

  //style

  const styleList = { display: show === false ? "block" : "none" };
  const styleCalender = { display: show === false ? "none" : "block" };

  return (
    <div className="h-screen w-screen bg-white flex px-0 py-0 relative">
      <NavBar />
      <div
        className="mx-0 my-0 h-screen w-[95vw] px-10 py-5 "
        style={{ backgroundColor: "whitesmoke", ...commentStyle }}
      >
        <div className="flex gap-2 justify-between">
          <h1 className="text-black text-[25px] font-semibold">
            Leave Request
          </h1>
          <div className="flex gap-2 items-center">
            <p
              className="text-[#6a77f9] text-[17px]  hover:underline underline-offset-1 cursor-pointer"
              onClick={() => navigate("/history")}
            >
              <span>
                <i className="fa-solid fa-clock-rotate-left"></i>
              </span>{" "}
              history
            </p>
            <button
              className="bg-[#6a77f9] text-white w-[7vw] cursor-pointer px-2 py-2 rounded-lg text-[17px]"
              onClick={() => setShow((prev) => !prev)}
            >
              <span>
                <i className="fa-solid fa-list"></i>
              </span>{" "}
              List
            </button>
            <button
              className="bg-[#6a77f9] text-white w-[7vw] cursor-pointer px-2 py-2 rounded-lg text-[17px]"
              onClick={() => setShow((prev) => !prev)}
            >
              <span>
                <i className="fa-solid fa-calendar-week"></i>
              </span>{" "}
              Calender
            </button>
          </div>
        </div>
        <div style={styleList}>
          {localStorage.getItem("employee_role") === "Manager" ? (
            <table className="bg-white shadow-lg w-[90vw] my-2">
              <thead className="bg-[#6a77f9] text-white">
                <tr>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Employee ID
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Name
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Type
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Start
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    End
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Total Days
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Reason
                  </th>
                  <th
                    className="text-[16px] font-normal w-auto h-10 border"
                    colSpan={2}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveRequestListManager.flat().sort((a, b) => b.LeaveRequestId - a.LeaveRequestId).map((request, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition">
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Employee_Id}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Employee_name}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Leave_Type}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {formatDate(request.Start_Date)}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {formatDate(request.End_Date)}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Leave_Count}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Reason}
                    </td>
                    {/* change */}
                    <td className="flex justify-center items-center gap-3 w-full py-2">
                      <button
                        onClick={() =>
                          ManagerChangeStatus(
                            1,
                            request.LeaveRequestId,
                            "Leave Approve"
                          )
                        }
                        className="border border-green-700 px-3 py-1 text-green-700 rounded-lg hover:bg-green-100 transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setDefaultValue((prev) => ({
                            ...prev,
                            changeStatus: 7,
                            Employee_Id: request.Employee_Id,
                            LeaveRequestId: request.LeaveRequestId,
                            Leave_Count: request.Leave_Count,
                            leave_Type_ID: request.leave_Type_ID,
                          }));

                          setCommentForm("pop");
                        }}
                        className="border border-red-600 px-3 py-1 text-red-600 rounded-lg hover:bg-red-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : localStorage.getItem("employee_role") === "HR" ? (
            <table className="bg-white shadow-lg w-[90vw] my-2">
              <thead className="bg-[#6a77f9] text-white">
                <tr>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Employee ID
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Name
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Type
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Start
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    End
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Total Days
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Reason
                  </th>

                  <th
                    className="text-[16px] font-normal w-auto h-10 border"
                    colSpan={2}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveRequestListHR.flat().sort((a, b) => b.LeaveRequestId - a.LeaveRequestId).map((request, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition">
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Employee_Id}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Employee_name}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Leave_Type}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {formatDate(request.Start_Date)}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {formatDate(request.End_Date)}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Leave_Count}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Reason}
                    </td>

                    <td className="flex justify-center items-center gap-3 w-full py-2">
                      <button
                        onClick={() =>
                          HRChangeStatus(
                            6,
                            request.Employee_Id,
                            request.LeaveRequestId,
                            request.Leave_Count,
                            request.leave_Type_ID,
                            "Leave Approved"
                          )
                        }
                        className="border border-green-700 px-3 py-1 text-green-700 rounded-lg hover:bg-green-100 transition cursor-pointer"
                      >
                        Approved
                      </button>
                      <button
                        onClick={() => {
                          setDefaultValue((prev) => ({
                            ...prev,
                            changeStatus: 7,
                            Employee_Id: request.Employee_Id,
                            LeaveRequestId: request.LeaveRequestId,
                            Leave_Count: request.Leave_Count,
                            leave_Type_ID: request.leave_Type_ID,
                          }));

                          setCommentForm("pop");
                        }}
                        className="border border-red-600 px-3 py-1 text-red-600 rounded-lg hover:bg-red-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : localStorage.getItem("employee_role") === "Director" ? (
            <table className="bg-white shadow-lg w-[90vw] my-2">
              <thead className="bg-[#6a77f9] text-white">
                <tr>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Employee ID
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Name
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Type
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Start
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    End
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Total Days
                  </th>
                  <th className="text-[16px] font-normal w-auto h-10 border">
                    Reason
                  </th>
                  <th
                    className="text-[16px] font-normal w-auto h-10 border"
                    colSpan={2}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveRequestListDirector.flat().sort((a, b) => b.LeaveRequestId - a.LeaveRequestId).map((request, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition">
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Employee_Id}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Employee_name}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Leave_Type}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {formatDate(request.Start_Date)}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {formatDate(request.End_Date)}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Leave_Count}
                    </td>
                    <td className="text-[16px] font-normal px-3 py-2 h-[7vh]">
                      {request.Reason}
                    </td>
                    {/* chnage */}
                    <td className="flex justify-center items-center gap-3 w-full py-2">
                      <button
                        onClick={() =>
                          DirectorChangeStatus(
                            6,
                            request.Employee_Id,
                            request.LeaveRequestId,
                            request.Leave_Count,
                            request.leave_Type_ID,
                            "Leave Approved"
                          )
                        }
                        className="border border-green-700 px-3 py-1 text-green-700 rounded-lg hover:bg-green-100 transition cursor-pointer"
                      >
                        Approved
                      </button>
                      <button
                       onClick={() => {
                        setDefaultValue((prev) => ({
                          ...prev,
                          changeStatus: 7,
                          Employee_Id: request.Employee_Id,
                          LeaveRequestId: request.LeaveRequestId,
                          Leave_Count: request.Leave_Count,
                          leave_Type_ID: request.leave_Type_ID,
                        }));

                        setCommentForm("pop");
                      }}
                        className="border border-red-600 px-3 py-1 text-red-600 rounded-lg hover:bg-red-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <></>
          )}
        </div>
        <div style={styleCalender}>
          <div style={{ height: "500px", marginTop: "30px" }}>
            <Calendar
              localizer={localizer}
              events={mapLeaveRequestsToEvents(
                leaveRequestListManager,
                leaveRequestListHR,
                leaveRequestListDirector
              )}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              style={{ height: 600 }}
            />
          </div>
        </div>
      </div>
      {commentForm === "pop" && (
        <div className="h-fit w-140 bg-[#6a77f9] flex flex-col gap-2 absolute right-120 top-30 rounded-xl px-2 py-2">
          <button
            className="absolute top-3 right-5 text-black  text-xl font-bold cursor-pointer hover:text-red-500"
            onClick={() => setCommentForm("not")}
          >
            ×
          </button>

          <div className="h-10 bg-gray-200 rounded-2xl px-5 py-2 flex gap-5 items-center">
            <i className="fa-solid fa-comment text-gray-500 text-[20px]"></i>
            <h1 className="text-[17px]">Comment</h1>
          </div>

          <div className="h-fit bg-gray-200 flex gap-2 px-2 rounded-2xl items-center">
            <textarea
              placeholder="Add a comment"
              className="w-full h-fit p-3 rounded-xl border-gray-300 text-sm focus:outline-none resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="bg-[#6a77f9] text-white rounded-xl w-20 h-8 cursor-pointer"
              onClick={() => {
                // leaveRequestChange(
                //   7,
                //   request.Employee_Id,
                //   request.LeaveRequestId,
                //   request.Leave_Count,
                //   request.leave_Type_ID
                // );
                setCommentForm("open");
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveList;
