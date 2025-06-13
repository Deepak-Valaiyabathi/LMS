import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import balance from "../assets/LeaveBalance.jpg";
import Calendar from "../components/Calender";
import LeaveForm from "../pages/Leave";
import file from "../assets/Leave Policy Document.pdf";
import LeaveStatusTimeline from "../components/LeaveStatusTimeline";

type leave_Balance = {
  total_leave: number;
  name: string;
  id:number;
};
type LeaveRequestStatus = {
  name: string;
  id: number;
  start_date: string;
  end_date: string;
  count: number;
  status: number;
};
type TeamLeaveRequestStatus = {
  name: string;
  start_date: string;
  end_date: string;
  count: number;
  status: string;
};

const LeaveRequest = () => {
  const [name, setName] = useState<string | null>(null);
  const [leaveBalance, setLeaveBalance] = useState<leave_Balance[]>([]);
  const [leaveRequestStatus, setLeaveRequestStatus] = useState<
    LeaveRequestStatus[]
  >([]);
  const [teamLeaveStatus, setTeamLeaveStatus] = useState<
    TeamLeaveRequestStatus[]
  >([]);
  const [openRequestId, setOpenRequestId] = useState<number | null>(null);

  const toggleTimeline = (id: number) => {
    setOpenRequestId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const token = localStorage.getItem("token")!;
    const employee_id = localStorage.getItem("employee_id")!;
    const employee_name = localStorage.getItem("employee_name");
    const manager_id = localStorage.getItem("manager_id");

    setName(employee_name);

    if (token && employee_id) {
      leaveDataFetch(token, employee_id);
      leaveStatusFetch(token, employee_id);
    }

    if (token && manager_id) {
      console.log(manager_id);
      teamLeaveRequestStatus(token, manager_id, employee_id);
    }
  }, []);
  //Leave balance status
  const leaveDataFetch = async (token: string, employee_id: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/leave-balance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id }),
        credentials: "include",
      });
      const result = await response.json();
      setLeaveBalance(result.leaveBalance);
    } catch (err) {
      console.error(err);
    }
  };
  // leave request status
  const leaveStatusFetch = async (token: string, employee_id: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/leave-request-status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employee_id }),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (Array.isArray(result.leaveStatus)) {
        setLeaveRequestStatus(result.leaveStatus as LeaveRequestStatus[]);
      } else {
        console.log("Not available", result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // team members leave status

  const teamLeaveRequestStatus = async (
    token: string,
    manager_id: string,
    employee_id: string
  ) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/team-members/leave-status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ manager_id, employee_id }),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (Array.isArray(result.teamLeaveStatus)) {
        setTeamLeaveStatus(result.teamLeaveStatus as TeamLeaveRequestStatus[]);
      } else {
        console.log("Not available", result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // leave request cancel

  const leaveCancel = async (Leave_Request_Id: number) => {
    const token = localStorage.getItem("token")!;
    try {
      const response = await fetch(
        "http://localhost:5000/api/leave-request/employee-update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Leave_Request_Id }),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result.message === "Leave successfully canceled") {
        window.location.reload();
      } else {
        console.log("Not available", result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  //date format converter
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="h-screen w-screen bg-white  flex px-0 py-0 ">
      <NavBar />
      <div
        className="mx-0 my-0 h-screen w-[95vw]  px-10 py-5"
        style={{ backgroundColor: "whitesmoke" }}
      >
        <h1 className="text-[25px] font-medium">{`Hello, ${name}!`}</h1>
        <div className="m-0 flex h-[90vh] w-[90vw] px-0 py-0">
          <main className="m-0 h-[90vh] w-[65vw] px-0 py-0 gap-5">
            <div className="h-[19vh] w-[65vw] bg-white/30 backdrop-blur-none items-center rounded-lg flex flex-col shadow-lg justify-center">
              <div className="m-0 h-[15vh] w-[63vw] px-0 py-5 bg-white flex justify-around">
                {leaveBalance.map((arr) => (
                  <div className="m-2 h-[9vh] w-[20vw] flex items-center justify-center gap-5 border-r-4 border-[#6a77f9]">
                    <h1 className=" text-[75px] text-[#6a77f9]">
                      {arr.total_leave}
                    </h1>
                    <h1 className=" text-[17px]">{arr.name}</h1>
                  </div>
                ))}

                <img
                  src={balance}
                  alt="balcnce leave image"
                  className=" h-[10vh] w-auto"
                />
              </div>
            </div>
            <div className="h-[70vh] w-[65vw] flex justify-evenly gap-3 mt-2">
              <div className="bg-white h-[66vh] w-[43vw] rounded-lg shadow-lg px-2 py-2">
                {/* <Calendar /> */}
                <div className="flex justify-between items-center  ml-5 px-2 py-2">
                  <div className=" flex gap-3 items-center">
                    <i className="fa-solid fa-calendar-week text-black text-[25px]"></i>
                    <h1 className="text-[#6a77f9] text-[25px] text-black">
                      Leave Request
                    </h1>
                  </div>

                  <a href={file} download={file} className="text-[15px]">
                    <button className="bg-[#6a77f9] w-fit h-fit px-2 py-1 text-white rounded-md text-[17px] cursor-pointer">
                      Leave policy <i className="fa-solid fa-download"></i>
                    </button>
                  </a>
                </div>
                <div className="flex h-[55vh] w-fit">
                 
                  <LeaveForm leaveBalance={leaveBalance}/>
                  <div>
                    <h1 className="text-center text-[25px]">Holidays</h1>
                    <Calendar />
                    <div className="flex justify-evenly">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#4ED7F1] rounded-full h-5 w-5"></div>
                        <h1 className="text-[17px]">Floater</h1>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-[#FE5D26] rounded-full h-5 w-5"></div>
                        <h1 className="text-[17px]">Holiday</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white h-[66vh] w-[25vw] border-box rounded-lg shadow-lg py-2">
                <h1 className="text-center text-[25px]">
                  <span>
                    <i className="fa-solid fa-people-group"></i>
                  </span>{" "}
                  My Team Leaves
                </h1>
               <div className="overflow-y-scroll h-[60vh]" id="myTeamLeaveScroll">
               {teamLeaveStatus.length === 0 ? (
                  <h1 className="text-center text-gray-500 text-[18px] my-4">
                    No leaves
                  </h1>
                ) : (
                  teamLeaveStatus.flat().map((request, index) => (
                    <div
                      key={index}
                      className="my-3 h-[12vh] flex flex-col justify-center gap-1"
                    >
                      <div className="flex justify-between px-4">
                        <h1 className="text-[19px]">{request.name}</h1>
                        <h1 className="w-[110px] text-[19px] text-center rounded-lg px-2 bg-[#6a77f9] text-white">
                          On Leave
                        </h1>
                      </div>
                      <div className="flex justify-between pl-4 pr-6">
                        <h1 className="text-[17px]">
                          {formatDate(request.start_date)}
                        </h1>
                        <h1 className="text-[17px]">{`${request.count} Days`}</h1>
                        <h1 className="text-[17px]">
                          {formatDate(request.end_date)}
                        </h1>
                      </div>
                    </div>
                  ))
                )}
               </div>
              </div>
            </div>
          </main>
          <aside className="m-0 h-[90vh] w-[25vw] place-items-center">
            <div
              className="m-0 h-[86vh] w-[23vw] bg-white shadow-lg rounded-lg px-2 py-4 overflow-y-auto"
              id="myLeaveScroll"
            >
              <h1 className="text-[25px] text-center">
                <span>
                  <i className="fa-regular fa-file-lines"></i>
                </span>{" "}
                My Latest Leave
              </h1>
              {!leaveRequestStatus || leaveRequestStatus.length === 0 ? (
                <h1 className="text-center text-gray-500 text-[18px] my-4">
                  You have not applied for any leave
                </h1>
              ) : (
                leaveRequestStatus.flat().map((request, index) => {
                  const statusColor =
                    request.status == 7
                      ? "red"
                      : request.status == 6
                      ? "#72b043"
                      : "blue";

                  return (
                    <div
                      key={index}
                      className="my-3 h-fit flex flex-col bg-gray-100 justify-center gap-1 relative group px-4 py-2 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-center">
                        <h1 className="text-[19px]">{request.name}</h1>
                        <h1
                          style={{
                            border: `2px solid ${statusColor}`,
                            color: statusColor,
                          }}
                          className={`w-[110px] text-[17px] text-center rounded-lg px-2 ${
                            request.status === 1 ? "group-hover:hidden" : ""
                          }`}
                        >
                          {request.status === 6
                            ? "Approved"
                            : request.status === 7
                            ? "Rejected"
                            : "Pending"}
                        </h1>

                        {request.status == 1 && (
                          <button
                            className="text-red-500 text-[20px] cursor-pointer hidden group-hover:block"
                            onClick={() => leaveCancel(request.id)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </div>

                      {/* Dates and count */}
                      <div className="flex justify-between text-[17px] px-1">
                        <h1>{formatDate(request.start_date)}</h1>
                        <h1>{`${request.count} Days`}</h1>
                        <h1>{formatDate(request.end_date)}</h1>
                      </div>

                      {request.name !== "Sick" && (
                        <p
                          className="text-right text-[#6a77f9] text-[17px] hover:underline underline-offset-1 cursor-pointer"
                          onClick={() => toggleTimeline(request.id)}
                        >
                          <i
                            className={`fa-solid ${
                              openRequestId === request.id
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            }`}
                          ></i>{" "}
                        </p>
                      )}

                      {openRequestId === request.id && (
                        <LeaveStatusTimeline request_id={request.id} />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
