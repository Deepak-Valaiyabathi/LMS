
import { leavePolicy } from "../controller/leaveController.js";
import {leaveType} from "../controller/leaveController.js";
import {leaveRequest} from "../controller/leaveController.js";
import { holiday } from "../controller/leaveController.js";
import {getHolidayList} from "../utility/leaveCount.js";
import {employeeLeaveUpdate} from "../controller/leaveController.js";
import { managerLeaveUpdate } from "../controller/leaveController.js";
import { hrLeaveUpdate } from "../controller/leaveController.js";
import { directorLeaveUpdate } from "../controller/leaveController.js";
import { leaveRequestStatus } from "../controller/leaveController.js";
import { leaveRequestStatusTimeline } from "../controller/leaveController.js";
import { teamMembersLeaveStatus } from "../controller/leaveController.js";
import { leaveRequestManager } from "../controller/leaveController.js";
import { leaveRequestHR } from "../controller/leaveController.js";
import { leaveRequestDirector } from "../controller/leaveController.js";
import { leavesHistory } from "../controller/leaveController.js";
import { holidays } from "../controller/leaveController.js";
import { leaveDateHistory } from "../controller/leaveController.js";
import { employeeType } from "../controller/leaveController.js";
import { leavePolicies } from "../controller/leaveController.js";
import { teamMemberCalender } from "../controller/leaveController.js";
import { leaveTypeShow } from "../controller/leaveController.js";

export const leaveRoute = [
  
 //=======> POST 🚩 <=========
   //******** Admin ********/

 // leave type create
      {
        method:"POST",
        path: "/api/leave-type",
        handler:leaveType,
      },
      //holiday create
      {
        method: "POST",
        path: "/api/holiday",
        handler:holiday,
      },
      // leave policy
      {
        method:"POST",
        path:"/api/leave-policy",
        handler:leavePolicy,
      },
      //=================> GET <===================
        {
          method: "get",
          path: "/api/get-holiday",
          handler:getHolidayList,
        },
  
   //******** Employee ********/
   //=======> POST 🚩 <=========

//leave apply
     {
      method:"POST",
      path:"/api/leave-request",
      handler:leaveRequest,
     },
 
     // user see the leave request status

     {
      method:"POST",
      path:"/api/leave-request-status",
      handler:leaveRequestStatus,
     },

     //user see the leave request status approved timeline
 {
  method:"POST",
  path:"/api/leave-request-status-timeline",
  handler:leaveRequestStatusTimeline,
 },
       //******** Employee see automatic data********/
  //+++++++++++++ Post ++++++++++f
  //
  // team members leave status
  {
    method:"POST",
    path:"/api/team-members/leave-status",
    handler:teamMembersLeaveStatus,
   },


   //team members leave dates
   {
    method: "POST",
    path: "/api/team-members/leaves-dates",
    handler:teamMemberCalender,
   },
     // manager see the leave request 
      {
       method:"POST",
       path:"/api/leave-request/manager",
       handler:leaveRequestManager,
      },

      // hr see the leave request

      {
        method:"POST",
        path:"/api/leave-request/HR",
        handler:leaveRequestHR,
      },

      // Director see the leave request

      {
        method: "POST",
        path:"/api/leave-request/Director",
        handler:leaveRequestDirector,
      },

      // Manger see the leaves history

      {
        method: "POST",
        path:"/api/leaves-history",
        handler:leavesHistory,
      },

      {
        method: "POST",
        path: "/api/leave-date-history",
        handler:leaveDateHistory,
      },

    
      //=======> PUT 🆙 <=========
      // employee cancel the leave
     {
      method:"PUT",
      path:"/api/leave-request/employee-update",
      handler:employeeLeaveUpdate,
     },

     // manager accepet or cancel the leave

     {
      method:"PUT",
      path:"/api/leave-request/manager-update",
      handler:managerLeaveUpdate,
     },

     // HR accept or cancel the leave

     {
      method:"PUT",
      path:"/api/leave-request/hr-update",
      handler:hrLeaveUpdate,
     },

     //Director accept or cancel the leave

     {
      method:"PUT",
      path:"/api/leave-request/director-update",
      handler:directorLeaveUpdate,
     },
   //==========GET==============
  // all user see the holidays
  {
    method: "GET",
    path:"/api/holidaysShow",
    handler:holidays
  },

  // employee type show
  {
    method:"GET",
    path:"/api/employee-types",
    handler:employeeType
  },

  // leave policy show
  {
    method:"GET",
    path:"/api/leave-policies",
    handler:leavePolicies
  },

  // leave type show
  {
    method:"GET",
    path:"/api/leave-type-show",
    handler:leaveTypeShow
  }
];


 