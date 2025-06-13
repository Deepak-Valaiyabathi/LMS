
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar"
import TeamCalender from "../components/TeamCalender";
import male from "../assets/boy.jpg";
import female from "../assets/girl.jpg"

type Peer = {
  Employee_name: string;
  Employee_email: string;
  Location: string;
  Gender:string;
  Employee_job_title: string;
};

function Team() {

  const [peersDetails, setPeersDetails] = useState<Peer[]>([]);

  const peersHandler = async (token:string, id:string) => {
    try {
      
      const response = await fetch(
        "http://localhost:5000/api/peers",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result && typeof result === "object") {
        setPeersDetails(result.peersData);
        console.log("Leave data:", result);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    const token = localStorage.getItem("token");
    const managerId = localStorage.getItem("manager_id");
    
    if (!token) {
      console.error("Missing token");
      return;
    }
 
    let manager_id_to_send: string | null = null;
    
      manager_id_to_send = managerId;
   
    if (!manager_id_to_send) {
      console.error("Missing manager_id to send to backend.");
      return;
    }
    
    peersHandler(token, manager_id_to_send)
    
  },[])
    
  return (
    <div className="h-screen w-screen bg-white flex px-0 py-0 ">
        <NavBar/>
        <div
        className="mx-0 my-0 h-screen w-[95vw]  px-10 py-5"
        style={{ backgroundColor: "whitesmoke" }}>
         <h1 className="text-black text-[25px] font-semibold">
            Team Calender
          </h1>
          <TeamCalender/>
          <div className="mt-2">
          <h1 className="text-black text-[25px] font-semibold">Peers</h1>
          <div className="grid grid-cols-4 gap-3">
          {peersDetails && peersDetails.length > 0 ? (
            peersDetails.map((request, index) => (
    <div key={index} className="h-45 min-w-80 bg-white shadow-xl flex gap-2 p-4 m-2 rounded-xl">
       {request.Gender === "Male" ? <img src={male} alt="male" className="h-15 w-15 rounded-[50%]" /> :  <img src={female} alt="female" className="h-15 w-15 rounded-[50%]" />}
     <div className="flex flex-col gap-3">
     <div>
      <h1 className="text-[30px] font-thin">{request.Employee_name}</h1>
      <h1 className="font-thin text-[17px]">{request.Employee_job_title}</h1>
      </div>
      <h1 className="text-[17px]">Email: {request.Employee_email}</h1>
      <h1 className="text-[17px]">Location: {request.Location}</h1>
     </div>
    </div>
  ))
) : (
  <div>No data</div>
)}
          </div>
        </div>
        </div>
        
        </div>
  )
}

export default Team