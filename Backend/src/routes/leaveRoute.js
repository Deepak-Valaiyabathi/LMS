import {
  leavePolicy,
  leaveType,
  leaveRequest,
  holiday,
  employeeLeaveUpdate,
  managerLeaveUpdate,
  hrLeaveUpdate,
  directorLeaveUpdate,
  leaveRequestStatus,
  leaveRequestStatusTimeline,
  teamMembersLeaveStatus,
  leaveRequestManager,
  leaveRequestHR,
  leaveRequestDirector,
  leavesHistory,
  holidays,
  leaveDateHistory,
  employeeType,
  leavePolicies,
  teamMemberCalender,
  leaveTypeShow
} from "../controller/leaveController.js";

import { getHolidayList } from "../utility/leaveCount.js";



export const leaveRoute = [
  //=======> POST 🚩 <=========

  //******** Admin ********/

  // leave type create
  {
    method: "POST",
    path: "/api/leave-type",
    handler: leaveType,
  },
  //holiday create
  {
    method: "POST",
    path: "/api/holiday",
    handler: holiday,
  },
  // leave policy create
  {
    method: "POST",
    path: "/api/leave-policy",
    handler: leavePolicy,
  },

  //******** Employee ********/

  //leave apply
  {
    method: "POST",
    path: "/api/leave-request",
    handler: leaveRequest,
  },

 
  //=======> GET  <=========

  //******** Admin ********/

  {
    method: "GET",
    path: "/api/get-holiday",
    handler: getHolidayList,
  },


  // employee type show
  {
    method: "GET",
    path: "/api/employee-types",
    handler: employeeType,
  },

  // leave policy show
  {
    method: "GET",
    path: "/api/leave-policies",
    handler: leavePolicies,
  },

  // leave type show
  {
    method: "GET",
    path: "/api/leave-type-show",
    handler: leaveTypeShow,
  },

  // ============ Employee ===========

    // user see the leave request status

    {
      method: "GET",
      path: "/api/leave-request-status/{employee_id}",
      handler: leaveRequestStatus,
    },

      // empoyee holiday show
  {
    method: "GET",
    path: "/api/holidaysShow",
    handler: holidays,
  },

  // team members leave status
  {
    method: "GET",
    path: "/api/team-leave-request-status/{manager_id}/{employee_id}",
    handler: teamMembersLeaveStatus,
  },

  //team members leave dates
  {
    method: "GET",
    path: "/api/team-members/leaves-dates/{manager_id}",
    handler: teamMemberCalender,
  },

  //user see the leave request status approved timeline

  {
    method: "GET",
    path: `/api/leave-request-status-timeline/{request_id}`,
    handler: leaveRequestStatusTimeline,
  },

   // manager see the leave request

   {
    method: "GET",
    path: "/api/leave-request/manager/{employee_id}",
    handler: leaveRequestManager,
  },

  
  // hr see the leave request

  {
    method: "GET",
    path: "/api/leave-request/HR/{employee_id}",
    handler: leaveRequestHR,
  },

  // Director see the leave request

  {
    method: "GET",
    path: "/api/leave-request/Director/{employee_id}",
    handler: leaveRequestDirector,
  },

  // Manger and HR and Director see the leaves history

  {
    method: "GET",
    path: "/api/leaves-history/{employee_id}",
    handler: leavesHistory,
  },


  // all user leave request dates
  {
    method: "GET",
    path: "/api/leave-date-history/{employee_id}",
    handler: leaveDateHistory,
  },


  // ==========> PUT <=========

  // ************ employee **************/

  {
    method: "PUT",
    path: "/api/leave-request/employee-update",
    handler: employeeLeaveUpdate,
  },

  // manager accepet or cancel the leave

  {
    method: "PUT",
    path: "/api/leave-request/manager-update",
    handler: managerLeaveUpdate,
  },

  // HR accept or cancel the leave

  {
    method: "PUT",
    path: "/api/leave-request/hr-update",
    handler: hrLeaveUpdate,
  },

  //Director accept or cancel the leave

  {
    method: "PUT",
    path: "/api/leave-request/director-update",
    handler: directorLeaveUpdate,
  },
];
