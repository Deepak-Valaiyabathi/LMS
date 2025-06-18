import { useEffect, useState } from "react";
import male from "../assets/boy.jpg";
import female from "../assets/girl.jpg";
import NavBar from "../components/NavBar";

function Home() {
  type JobDetail = {
    employee_id: string;
    date_of_joining: string;
    job_title: string;
    worker_type: string;
    time_type: string;
    location: string;
    reporting_manager: string;
  };

  type personalDetails = {
    employee_id: string;
    full_name: string;
    gender: string;
    marital_status: string;
    nationalty: string;
    mobile_number: string;
    date_of_birth: string;
    blood_group: string;
    address: string;
  };


 
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [personalDetail, setPersonalDetail] = useState<personalDetails | null>(
    null
  );
 
 



 
  useEffect(() => {
    const token = localStorage.getItem("token")!;
    const employee_id = localStorage.getItem("employee_id")!;
   
    if (token && employee_id) {
      jobDataFetch(token, employee_id);
      personalDataFetch(token, employee_id);
    }
  }, []);

  const jobDataFetch = async (token: string, employee_id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobDetails/${employee_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setJobDetails(result.jobDetails);
    } catch (err) {
      console.error(err);
    }
  };

  const personalDataFetch = async (token: string, employee_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/personalDetails/${employee_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setPersonalDetail(result.personalDetails);
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
    // <div className="h-screen w-screen px-5 py-5 bg-white relative">
    //   <div className="w-388 h-80 bg-[#FFFDF6] flex justify-evenly items-center border-3 border-[#B0DB9C]" style={opacity}>
    //     <img src={male} alt="male" className="h-60 w-50 " />
    //     <div className="w-320 h-60 flex flex-col justify-evenly">
    //       <h1 className="text-black text-[40px] items-center px-0 py-0">
    //         {name}
    //       </h1>
    //       <div className="grid grid-cols-4 gap-4 items-center ">
    //         {jobDetails ? (
    //           Object.entries(jobDetails).map(([key, value]) => (
    //             <h1 key={key} className="text-black text-[20px]">
    //               {key.replace(/_/g, " ")}:{" "}
    //               {key === "Date_of_joining"
    //                 ? new Date(value as string).toLocaleDateString()
    //                 : String(value)}
    //             </h1>
    //           ))
    //         ) : (
    //           <p className="text-black text-[20px]">Loading job details...</p>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex mt-2 gap-5" style={opacity}>
    //     <div className="border-3 border-[#B0DB9C] h-[50vh] w-[50vw] bg-[#FFFDF6] ">
    //       <h4 className="text-black mx-2 my-2 text-[20px]">Personal Details</h4>
    //       <div className="grid grid-cols-2 gap-5 mx-2 my-2">
    //         {personalDetail ? (
    //           Object.entries(personalDetail).map(([key, value]) => (
    //             <h1 key={key} className="text-black text-[20px]">
    //               {key.replace(/_/g, " ")}:{" "}
    //               {key === "Date_of_Birth"
    //                 ? new Date(value as string).toLocaleDateString()
    //                 : String(value)}
    //             </h1>
    //           ))
    //         ) : (
    //           <p className="text-black text-[20px]">Loading job details...</p>
    //         )}
    //       </div>
    //     </div>
    //     <div className="border-3 border-[#B0DB9C] h-[50vh] w-[50vw] px-2 py-2 bg-[#FFFDF6] ">
    //       <h4 className="text-black mx-2 my-2 text-[20px]">Leave Balance</h4>
    //       <div className="flex">
    //         <div className="px-5">
    //           <div className="flex justify-evenly text-black items-center">
    //             <h1 className="text-[75px] mr-4 text-black">
    //               {leaveBalance?.Balance_leave}
    //             </h1>
    //             <h1 className="text-[25px] font-light">Balance</h1>
    //           </div>
    //           <div className="flex justify-evenly text-black items-center">
    //             <h1 className="text-[75px] mr-4 text-black">
    //               {leaveBalance?.Taken_leave}
    //             </h1>
    //             <h1 className="text-[25px] font-light">Taken</h1>
    //           </div>
    //         </div>
    //         <div className="border-2 border-[#B0DB9C] w-[450px] flex flex-col justify-center items-center ">
        
               
    //             {/* <table className="border-1 border-[#B0DB9C] w-[425px] h-[200px] text-black text-center">
    //             <tr>
    //             <th>Status</th>
    //             <th>Start date</th>
    //             <th>End date</th>
    //             </tr>
                
    //             {leaveRequestPending.map((request) => (
    //               <tr>
    //               <td>{request.Leave_Request_Status}</td>
    //                 <td>{new Date(request.Start_Date).toLocaleDateString()}</td>
    //                 <td>{new Date(request.End_Date).toLocaleDateString()}</td>
    //                 </tr>
    //             ))}

    //         </table> */}
             
    //             <div className="text-black text-xl py-1 px-1 flex justify-evenly">
    //               <i className="fa-solid fa-broom text-[#B0DB9C] text-[50px]"></i>
    //               <div className="px-2">
    //               <p className="font-light text-[19px]">Hurray! No pending leave requests</p>
    //               <p className="font-light text-[19px]">Request leave on the right!</p>
    //               <button className="text-black bg-[#B0DB9C] px-2 py-2 mx-4 my-4 rounded-lg text-[20px] cursor-pointer" onClick={() => setFormShow((prev) => !prev)}
    //               >Leave Request</button>
    //               </div>
    //             </div>
             
    //         </div>
    //       </div>
    //       <p className="text-black text-[20px] mx-4  cursor-pointer hover:underline underline-offset-3">leave history</p>
         
    //     </div>
    //   </div>
    //   <div className="absolute top-5 right-0" style={style}>
    //   <LeaveRequest show={setFormShow} />
    //   </div>
     
    // </div>
    <div className="h-screen w-screen bg-white flex px-0 py-0 ">
     <NavBar/>
     <div className="mx-0 my-0 h-screen w-[95vw] flex flex-col gap-15 place-items-center justify-center">
        <div className="w-[90vw] h-[25vh] bg-white rounded-lg shadow-lg text-[20px] px-10 py-5 flex gap-14 items-center">
          {personalDetail?.gender === "Male" ? <img src={male} alt="male" className="h-30 w-30 rounded-[50%]" /> :  <img src={female} alt="female" className="h-30 w-30 rounded-[50%]" />}
          <div>
            <h1 className="text-[#6a77f9] text-[30px]">{personalDetail?.full_name}</h1>
            <h1>{jobDetails?.job_title}</h1>
            <h1>{jobDetails?.location}</h1>
          </div>
        </div>
        <div className="w-[90vw] h-[25vh] bg-white rounded-lg shadow-lg px-10 py-5 items-center">
          <h1 className="text-[25px] text-[#6a77f9]">Job Details</h1>
          <div className="grid grid-cols-4 gap-4 items-center mt-5 items-center">
              {jobDetails ? (
              Object.entries(jobDetails).map(([key, value]) => (
                <h1 key={key} className="text-black text-[17px]">
                  {key.replace(/_/g, " ")}:{" "}
                  {key === "date_of_joining"
                    ? new Date(value as string).toLocaleDateString()
                    : String(value)}
                </h1>
              ))
            ) : (
              <p className="text-black text-[17px]">Loading job details...</p>
            )}
          </div>
        </div>
        <div className="w-[90vw] h-[25vh] bg-white rounded-lg shadow-lg px-10 py-5 items-center">
          <h1 className="text-[25px] text-[#6a77f9]">Personal Details</h1>
                 <div className="grid grid-cols-4 gap-4 mx-2 my-2 ">
             {personalDetail ? (
               Object.entries(personalDetail).map(([key, value]) => (
                 <h1 key={key} className="text-black text-[17px]">
                   {key.replace(/_/g, " ")}:{" "}
                   {key === "date_of_birth"
                     ? formatDate(value)
                     : String(value)}
                 </h1>
               ))
             ) : (
               <p className="text-black text-[17px]">Loading job details...</p>
             )}
           </div>
        </div>
     </div>
    </div>
  );
}

export default Home;
