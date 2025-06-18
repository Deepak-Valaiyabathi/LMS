// routes/employee.routes.js
import { createEmployee } from "../controller/employeeController.js";
import { employeType } from "../controller/employeeController.js";
import { employeeDeactivate } from "../controller/employeeController.js";
import { employeeEdit } from "../controller/employeeController.js";
import { employeeDetails } from "../controller/employeeController.js";
import { employeeJobDetails } from "../controller/employeeController.js";
import { login } from "../controller/employeeController.js";
import { personalDetails } from "../controller/employeeController.js";
import { jobDetails } from "../controller/employeeController.js";
import { leaveBalance } from "../controller/employeeController.js";
import { employeeCountRole } from "../controller/employeeController.js";
import { getEmployeeList } from "../controller/employeeController.js";
import { peers } from "../controller/employeeController.js";

export const employeeRoutes = [
  // ============ POST ============

  // =========== Admin ===========

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
    handler: employeeDetails,
  },
  //employee job details add
  {
    method: "POST",
    path: "/api/employee-job-details-add",
    handler: employeeJobDetails,
  },
  // add employee type
  {
    method: "POST",
    path: "/api/employee-type-add",
    handler: employeType,
  },

  // ============ Employee ===========

  // user & admin login

  {
    method: "POST",
    path: "/api/login",
    handler: login,
  },

  //// ============ GET ============

  // =========== Admin ===========

  //employee count and role list
  {
    method: "GET",
    path: "/api/employee-count-role",
    handler: employeeCountRole,
  },
  // get employee list

  {
    method: "GET",
    path: "/api/get-employeesList",
    handler: getEmployeeList,
  },

  //==========User ===========

  // user see the job details
  {
    method: "GET",
    path: `/api/jobDetails/{employee_id}`,
    handler: jobDetails,
  },

  //user see the personal details
  {
    method: "GET",
    path: "/api/personalDetails/{employee_id}",
    handler: personalDetails,
  },

  //user see the leave balance
  {
    method: "GET",
    path: "/api/leave-balance/{employee_id}",
    handler: leaveBalance,
  },

  {
    method: "GET",
    path: "/api/peers/{manager_id}",
    handler: peers,
  },
  
  // =========== PUT ===========

  // =========== Admin ===========

  // employee deactivate
  {
    method: "PUT",
    path: "/api/employeeDeactivate",
    handler: employeeDeactivate,
  },

  // employee edit
  {
    method: "PUT",
    path: "/api/employeeEdit",
    handler: employeeEdit,
  },
];
