import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeTypes from "../components/EmployeeTypes";
import LeavePolicyComponent from "../components/LeavePolicyComponent";
import LeaveTypeManagement from "../components/LeaveTypeManagement";
import HolidayManager from "../components/HolidayManager";
interface RoleCount {
  role: string;
  count: number;
}
interface EmployeeDetails {
  employee_id: string;
  name: string;
  email: string;
  date_of_joining: string;
  manager_id: string;
  hr_id: string;
  director_id: string;
}

interface EmployeeaddEmployee {
  Employee_id: string;
  Empolyee_name: string;
  Employee_email: string;
  Password: string;
  Role_id: number;
  Manager_id: string;
  HR_id: string;
  Director_id: string;
}

interface addJobDetails {
  EmployeeId: string;
  Dateofjoining: string;
  JobTitle: string;
  WorkedType: string;
  TimeType: string;
  Location: string;
  ReportingManager: string;
}
interface EmployeeDetailsForm {
  EmployeeId: string;
  FullName: string;
  Gender: string;
  MaritalStatus: string;
  Nationality: string;
  MobileNumber: string;
  DateOfBirth: string;
  BloodGroup: string;
  Address: string;
}






function Admin() {
  const [roleCount, setRoleCount] = useState<RoleCount[]>([]);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails[]>([]);
  const [searchId, setSearchId] = useState<string>("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage.");
      return;
    }
    employeeCount(token);
    employeeList(token);
  }, []);
  const [eForm, setEFrom] = useState(false);

  const style = { display: eForm === true ? "block" : "none" };
 
  const [lTForm, setLTForm] = useState(false);

  const lTStyle = { display: lTForm === true ? "block" : "none" };

  const [lPForm, setLPForm] = useState(false);

  const lPStyle = { display: lPForm === true ? "block" : "none" };

  const [hForm, setHForm] = useState(false);

  const hStyle = { display: hForm === true ? "block" : "none" };

  const [eTForm, setETForm] = useState(false);

  const eTStyle = { display: eTForm === true ? "block" : "none" };

 
  
  // employee roles and count
  const employeeCount = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/employee-count-role",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      setRoleCount(result.result);
    } catch (err) {
      console.error("Error fetching employee count:", err);
    }
  };
  // employee roles and count color
  const textColors = [
    "text-red-600 text-[20px] font-medium",
    "text-blue-600 text-[20px] font-medium",
    "text-green-600 text-[20px] font-medium",
    "text-purple-600 text-[20px] font-medium",
    "text-yellow-600 text-[20px] font-medium",
    "text-pink-600 text-[20px] font-medium",
    "text-indigo-600 text-[20px] font-medium",
    "text-orange-600 text-[20px] font-medium",
  ];
  // employees list

  const employeeList = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/get-employeesList",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      setEmployeeDetails(result);
    } catch (err) {
      console.error("Error fetching employee count:", err);
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

  //   // add employee

  const [step, setStep] = useState(1);

  const [addEmployee, setAddEmployee] = useState<EmployeeaddEmployee>({
    Employee_id: "",
    Empolyee_name: "",
    Employee_email: "",
    Password: "",
    Role_id: 0,
    Manager_id: "",
    HR_id: "",
    Director_id: "",
  });

  const addEmployeeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/create-employee",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addEmployee),
          credentials: "include",
        }
      );

      const result = await response.json();
      if(result.message === "Employee added"){
        alert(result.message);
        setStep(2);
      }else{
        alert(result.message);
        setStep(1);
      }
      
    } catch (err) {
      console.error("Employee creation failed", err);
    }
  };

  //   // add job details

  const [addJobDetails, setAddJobDetails] = useState<addJobDetails>({
    EmployeeId: "",
    Dateofjoining: "",
    JobTitle: "",
    WorkedType: "",
    TimeType: "",
    Location: "",
    ReportingManager: "",
  });

  const addJobDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddJobDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addJobDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/employee-job-details-add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addJobDetails),
          credentials: "include",
        }
      );

      const result = await response.json();
      if(result.message === "employee job details added"){
        alert(result.message);
        setStep(3);
      }else{
        alert(result.message);
        setStep(2);
      }
     
    } catch (err) {
      console.error("Job details submission failed:", err);
    }
  };

  //   // add personal details

  const [addPerDetails, setAddPerDetails] = useState<EmployeeDetailsForm>({
    EmployeeId: "",
    FullName: "",
    Gender: "",
    MaritalStatus: "",
    Nationality: "",
    MobileNumber: "",
    DateOfBirth: "",
    BloodGroup: "",
    Address: "",
  });

  const addEmployeePersonalChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAddPerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPersonalDetailsSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/employee-details-add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addPerDetails),
          credentials: "include",
        }
      );

      const result = await response.json();

      if(result.message === "employee details added"){
        alert(result.message);
        setStep(1);
      }else{
        alert(result.message);
        setStep(3);
      }
   
    } catch (err) {
      console.error("Error submitting personal details:", err);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("manager_id");
    localStorage.removeItem("employee_name");
    localStorage.removeItem("employee_role");
    navigate("/");
  };

 
  
 
  return (
    <div className="h-screen w-screen bg-white border-box h-[100vh] relative">
      {/* <header className="flex justify-evenly bg-[#6a77f9] shadow-xl text-black h-[10vh] items-center  mb-[5px]">
        <h1 className="text-[30px]">Lumel</h1>
        <input
          className=" outline-none border-2 border-black px-2 py-2 w-[310px] rounded-lg"
          type="text"
          placeholder="Search the Employee id: "
        />
      </header> */}
      <main
        className="h-screen w-[100vw] flex justify-evenly"
        style={{ backgroundColor: "whitesmoke" }}
      >
        <div style={style} className="absolute top-10 left-150 w-[40vw]">
          {step === 1 && (
            <form
              className="space-y-4 p-4 bg-white text-black rounded-lg shadow max-w-md shadow-xl absolute"
              onSubmit={handleEmployeeSubmit}
            >
              <h1 className="text-center text-[25px]">Add Employee</h1>

              <input
                type="text"
                name="Employee_id"
                placeholder="Employee ID"
                value={addEmployee.Employee_id}
                onChange={addEmployeeChange}
                required
                className="w-full border px-3 py-2"
              />
              <input
                type="text"
                name="Empolyee_name"
                placeholder="Employee Name"
                value={addEmployee.Empolyee_name}
                onChange={addEmployeeChange}
                required
                className="w-full border px-3 py-2"
              />
              <input
                type="email"
                name="Employee_email"
                placeholder="Email"
                value={addEmployee.Employee_email}
                onChange={addEmployeeChange}
                required
                className="w-full border px-3 py-2"
              />
              <input
                type="password"
                name="Password"
                placeholder="Password"
                value={addEmployee.Password}
                onChange={addEmployeeChange}
                required
                className="w-full border px-3 py-2"
              />
              <select
                name="Role_id"
                value={addEmployee.Role_id}
                onChange={addEmployeeChange}
                required
                className="w-full border px-3 py-2"
              >
                <option value="">Select Role</option>
                <option value="1">Developer</option>
                <option value="2">HR</option>
                <option value="5">Intern</option>
                <option value="3">Manager</option>
                <option value="4">Director</option>
                <option value="10">Admin</option>
              </select>

              <input
                type="text"
                name="Manager_id"
                placeholder="Manager ID"
                value={addEmployee.Manager_id}
                onChange={addEmployeeChange}
                className="w-full border px-3 py-2"
              />
              <input
                type="text"
                name="HR_id"
                placeholder="HR ID"
                value={addEmployee.HR_id}
                onChange={addEmployeeChange}
                className="w-full border px-3 py-2"
              />
              <input
                type="text"
                name="Director_id"
                placeholder="Director ID"
                value={addEmployee.Director_id}
                onChange={addEmployeeChange}
                className="w-full border px-3 py-2"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#6a77f9] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-[#6a77f9] text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => setEFrom((prev) => !prev)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              className="space-y-4 max-w-md mx-auto p-4 shadow-md border bg-white rounded absolute"
              onSubmit={addJobDetailsSubmit}
            >
              <h1 className="text-center text-[25px]">Job Details</h1>

              <input
                type="text"
                name="EmployeeId"
                placeholder="Employee ID"
                value={addJobDetails.EmployeeId}
                onChange={addJobDetailsChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="date"
                name="Dateofjoining"
                value={addJobDetails.Dateofjoining}
                onChange={addJobDetailsChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="text"
                name="JobTitle"
                placeholder="Job Title"
                value={addJobDetails.JobTitle}
                onChange={addJobDetailsChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <select
                name="WorkedType"
                value={addJobDetails.WorkedType}
                onChange={addJobDetailsChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Worked Type</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <select
                name="TimeType"
                value={addJobDetails.TimeType}
                onChange={addJobDetailsChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Time Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>

              <input
                type="text"
                name="Location"
                placeholder="Location"
                value={addJobDetails.Location}
                onChange={addJobDetailsChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="text"
                name="ReportingManager"
                placeholder="Reporting Manager"
                value={addJobDetails.ReportingManager}
                onChange={addJobDetailsChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#6a77f9] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form
              className="max-w-lg space-y-3 h-auto px-3 py-1 shadow-lg border rounded-md bg-white absolute"
              onSubmit={addPersonalDetailsSubmit}
            >
              <h1 className="text-center text-[25px]">Personal Details</h1>

              <input
                type="text"
                name="EmployeeId"
                placeholder="Employee ID"
                value={addPerDetails.EmployeeId}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="text"
                name="FullName"
                placeholder="Full Name"
                value={addPerDetails.FullName}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <select
                name="Gender"
                value={addPerDetails.Gender}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="MaritalStatus"
                value={addPerDetails.MaritalStatus}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>

              <input
                type="text"
                name="Nationality"
                placeholder="Nationality"
                value={addPerDetails.Nationality}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="tel"
                name="MobileNumber"
                placeholder="Mobile Number"
                value={addPerDetails.MobileNumber}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="date"
                name="DateOfBirth"
                value={addPerDetails.DateOfBirth}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <select
                name="BloodGroup"
                value={addPerDetails.BloodGroup}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A−">A−</option>
                <option value="B+">B+</option>
                <option value="B−">B−</option>
                <option value="O+">O+</option>
                <option value="O−">O−</option>
                <option value="AB+">AB+</option>
                <option value="AB−">AB−</option>
              </select>

              <textarea
                name="Address"
                placeholder="Address"
                value={addPerDetails.Address}
                onChange={addEmployeePersonalChange}
                className="w-full border px-3 py-2 rounded resize-none"
                rows={3}
                required
              />

              <div className="flex gap-5">
                <button
                  type="submit"
                  className="w-full bg-[#6a77f9] text-white py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="absolute top-10 left-150 w-[40vw]" style={lTStyle}>
          {/* leave type add form */}
        <LeaveTypeManagement setLTForm={setLTForm}/>
        </div>

        <div className="absolute top-10 left-80 w-fit" style={lPStyle}>
          {/* leave policy add form */}
       <LeavePolicyComponent setLPForm={setLPForm}/>
        </div>

        <div className="absolute top-10 left-150 w-fit" style={eTStyle}>
          {/* employee type add form */}
        
          <EmployeeTypes setETForm={setETForm}/>
        </div>

        <div className="absolute top-10 left-150 w-[40vw]" style={hStyle}>
          {/* holiday add form */}
        <HolidayManager setHForm={setHForm}/>
        </div>
        <div className="h-screen w-[5vw] bg-[#6a77f9] flex flex-col place-items-center justify-between py-10 text-white text-[25px]">
          <div className="flex flex-col justify-between h-[40vh] place-items-center ">
            <button onClick={() => setETForm((prev) => !prev)}>
              <i className="fa-solid fa-user-plus cursor-pointer"></i>
            </button>
            <button onClick={() => setLPForm((prev) => !prev)}>
              <i className="fa-solid fa-file-lines cursor-pointer"></i>
            </button>
            <button onClick={() => setLTForm((prev) => !prev)}>
              <i className="fa-solid fa-file-pen cursor-pointer"></i>
            </button>
            <button onClick={() => setHForm((prev) => !prev)}>
              <i className="fa-solid fa-calendar-days cursor-pointer"></i>
            </button>
          </div>
          <i
            className="fa-solid fa-right-from-bracket text-red-500 cursor-pointer"
            onClick={handleLogout}
          ></i>
        </div>
        <div className="mx-0 my-0 h-screen w-[95vw] flex flex-col gap-5 place-items-center px-2 py-2">
          <h1 className="text-[30px] mx-10">Admin Page</h1>
          <div className="flex gap-13 px-3 py-2 h-fit justify-center overflow-x-scroll md:overflow-hidden">
            {roleCount.map((obj, index) => {
              const colorClass = textColors[index % textColors.length];

              return (
                <div
                  key={index}
                  className="w-[200px] h-[100px] bg-white shadow-sm rounded-[30px] flex flex-col text-[17px] text-center justify-center"
                >
                  <h1 className={colorClass}>{obj.role}</h1>
                  <h1 className={colorClass}>{obj.count}</h1>
                </div>
              );
            })}
          </div>
          <div className=" bg-white px-2 place-items-center h-[70vh] w-[92vw] rounded-[25px]">
            <div className="flex justify-evenly place-items-none gap-20  px-5 py-2 h-[10vh] items-center border-b-1 border-gray-200">
              <h1 className="text-[25px]">Employee List</h1>
              <input
                type="text"
                placeholder="Search Employee Id"
                onChange={(e) => setSearchId(e.target.value.trim())}
                className="bg-gray-200 outline-none h-[7vh] text-black w-[300px] rounded-lg px-2 text-17px"
              />
              <button
                className="bg-[#6a77f9] text-white px-2 py-2 rounded-lg cursor-pointer"
                onClick={() => setEFrom((prev) => !prev)}
              >
                {" "}
                <span>
                  <i className="fa-solid fa-plus"></i>
                </span>{" "}
                Add Employee
              </button>
            </div>
            <div className="overflow-y-auto h-[60vh]" id="scroll">
              <table className="bg-white shadow-lg w-[90vw] my-2 ">
                <thead className="bg-[#6a77f9] text-white">
                  <tr>
                    <th className="text-[17px] font-normal w-35 h-10 border">
                      Employee ID
                    </th>
                    <th className="text-[17px] font-normal w-35 h-10 border">
                      Name
                    </th>
                    <th className="text-[17px] font-normal w-35 h-10 border">
                      Employee Email
                    </th>
                    <th className="text-[17px] font-normal w-20 h-10 border">
                      Joining Date
                    </th>
                    <th className="text-[17px] font-normal w-25 h-10 border">
                      Manager Id
                    </th>
                    <th className="text-[17px] font-normal w-25 h-10 border">
                      HR Id
                    </th>
                    <th className="text-[17px] font-normal w-25 h-10 border">
                      Director Id
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeDetails
                    .flat()
                    .filter((request) =>
                      searchId  ? request.employee_id.toLowerCase().includes(searchId.toLowerCase())
                    : true
                    )
                    .map((request, index) => (
                      <tr key={index} className="hover:bg-gray-100 transition">
                        <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
                          {request.employee_id}
                        </td>
                        <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
                          {request.name}
                        </td>
                        <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
                          {request.email}
                        </td>
                        <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
                          {formatDate(request.date_of_joining)}
                        </td>
                        <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
                          {request.manager_id}
                        </td>
                        <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
                          {request.hr_id}
                        </td>
                        <td className="text-[17px] font-normal px-3 py-2 h-[7vh]">
                          {request.director_id}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
