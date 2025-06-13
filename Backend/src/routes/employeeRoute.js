// routes/employee.routes.js
import { createEmployee } from "../controller/employeeController.js";
import { employeType } from "../controller/employeeController.js";
import { employeeDetails } from "../controller/employeeController.js";
import { employeeJobDetails } from "../controller/employeeController.js";
import { login } from "../controller/employeeController.js";
import { personalDetails } from "../controller/employeeController.js";
import { jobDetails } from "../controller/employeeController.js";
import { leaveBalance } from "../controller/employeeController.js";
import { employeeCountRole } from "../controller/employeeController.js"
import { getEmployeeList } from "../controller/employeeController.js";
import { peers } from "../controller/employeeController.js";

export const employeeRoutes = [

   //xxxxxxxxxxxxxxx Admin xxxxxxxxxxxx>

    //=======> POST 🚩 <=========
    // create employee or add new employee data
  {
    method: "POST",
    path: "/api/create-employee",
    handler: createEmployee,
  },
  
  //employee details add
  {
   method: "POST",
   path: "/api/employee-details-add",
   handler:employeeDetails,
  },
  //employee job details add
  {
    method: "POST",
    path:"/api/employee-job-details-add",
    handler:employeeJobDetails,
  },
   // add employee type
  {
    method:"POST",
    path:"/api/employee-type-add",
    handler:employeType,
  },
   //=#=#=#=#=#=# GET #=#=#=#=#=#=#=
  //employee count and role list
   {
    method: "GET",
    path:"/api/employee-count-role",
    handler:employeeCountRole,
   },

   
      // get employee list

      {
        method: "GET",
        path:"/api/get-employeesList",
        handler:getEmployeeList,
      },
  //<xxxxxxxxxxxx> user <xxxxxxxxxxxxxxxx>  

  //<============> Post 🚩<==============>

    // user & admin login
 
   {
    method: 'POST',
    path: '/api/login',
    handler: login,
   },


  //user see the leave balance
  {
    method: 'POST',
    path: '/api/leave-balance',
    handler: leaveBalance
  },

   //user see the personal details
   {
    method: "POST",
    path:"/api/personalDetails",
    handler:personalDetails,
   },
   // user see the job details
   {
    method: "POST",
    path:"/api/jobDetails",
    handler:jobDetails,
   },

   {
    method: "POST",
    path:"/api/peers",
    handler:peers,
   }
];
