

// controller/employeeController.js
import {
  createEmployeeModel,
  employeTypeModel,
  employeeDeactivateModel,
  employeeEditModel,
  employeeDetailsModel,
  employeeJobDetailsModel,
  loginModel,
  personalDetailsModel,
  jobDetailsModel,
  leaveBalanceModel,
  employeeCountRoleModel,
  getEmployeeListModel,
  peersModel
} from "../models/employeeModel.js";

import {loginValidation} from "../validation/loginValidation.js";
import {empployeeCreateValidation, employeePersonalD, employeeJobD, employeeT} from "../validation/employeeValidation.js";

//xxxxxxxxxxxxxxx Admin xxxxxxxxxxxx>

//=======> POST 🚩 <=========

// create employee or add new employee data
export const createEmployee = async (request, h) => {
  try {
    const {
      Employee_id,
      Empolyee_name,
      Employee_email,
      Password,
      Role_id,
      Manager_id,
      HR_id,
      Director_id,
    } = request.payload;
    

    const { error } = empployeeCreateValidation.validate({
      Employee_id,
      Empolyee_name,
      Employee_email,
      Role_id,
      Manager_id,
      HR_id,
      Director_id,
      Password,
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await createEmployeeModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "Employee added" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//employee details add
export const employeeDetails = async (request, h) => {
  try {
    const {EmployeeId,
      FullName,
      Gender,
      MaritalStatus,
      Nationality,
      MobileNumber,
      DateOfBirth,
      BloodGroup,
      Address} = request.payload;

    const { error } = employeePersonalD.validate({
      EmployeeId,
      FullName,
      Gender,
      MaritalStatus,
      Nationality,
      MobileNumber,
      DateOfBirth,
      BloodGroup,
      Address,
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await employeeDetailsModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "employee details added" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};
//employee job details add
export const employeeJobDetails = async (request, h) => {
  try {
    const {
      EmployeeId,
      Dateofjoining,
      JobTitle,
      WorkedType,
      TimeType,
      Location,
      ReportingManager
    } = request.payload;

   

    const { error } = employeeJobD.validate({
      EmployeeId,
      Dateofjoining,
      JobTitle,
      WorkedType,
      TimeType,
      Location,
      ReportingManager
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await employeeJobDetailsModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "employee job details added" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// empoyee type add
export const employeType = async (request, h) => {
  try {

    const {name, description} = request.payload;



    const { error } = employeeT.validate({
      name, description
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }


    const result = await employeTypeModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "employee type added" }).code(201);
    }
  } catch (err) {
    console.error(err);
  }
};


// PUT
// accoud deactivate
export const employeeDeactivate = async (request, h) => {
  try {
    const result = await employeeDeactivateModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "Account deactivated" }).code(201);
    } else {
      return h.response({ message: "Account deactivation failed" }).code(201);
    }
    
  } catch (err) {
    console.error(err);
    
  }
}
// employee edit 

export const employeeEdit = async (request, h) => {
  try {
    const result = await employeeEditModel(request.payload);

    const allSucceeded = result.every((data) => data.status === "success");

    if (allSucceeded) {
      return h.response({ message: "All accounts updated successfully" }).code(201);
    } else {
      return h.response({
        message: "Some account updates failed",
        details: result
      }).code(207);
    }
  } catch (err) {
    console.error(err);
  }
}






//=#=#=#=#=#=# GET #=#=#=#=#=#=#=
//employee count and role list
export const employeeCountRole = async (request, h) => {
  try {
    const result = await employeeCountRoleModel(request.payload);
    if (result.length > 0) {
      return h.response({ result: result });
    } else {
      h.response({ message: "employees not available" });
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// get employee list

export const getEmployeeList = async (request, h) => {
  try {
    const result = await getEmployeeListModel(request.payload);

    if (result.length > 0) {
      return h.response(result);
    } else {
      h.response({ message: "employees not available" });
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//<xxxxxxxxxxxx> user <xxxxxxxxxxxxxxxx>

//<============> Post 🚩<==============>

// user & admin login
export const login = async (request, h) => {
  try {
    const { email, password } = request.payload;

    console.log(password)

    const { error } = loginValidation.validate({ email, password });
   console.log(error, "login error");
    if (error) {
      return h.response({ message: error.details[0].message }).code(400);
    }

    const result = await loginModel(request.payload);
  
    console.log(result, "login result");

    const { token, id, name, emp_type_id, manager_id, role } = result;


    if(result.length === 0) {
      return h.response({ message: "login failed" }).code(404);
    }

 
    if (result.token.length > 0) {
      return h.response({
        token: token,
        id: id,
        name: name,
        emp_type_id: emp_type_id,
        manager_id: manager_id,
        role: role,
      });
    }

    if( result.affectedRows === 0) {
      return h.response({ message: "login failed" }).code(404);
    }

  } catch (err) {
    console.error(err);
  }
};

//user see the leave balance

export const leaveBalance = async (request, h) => {
  try {
    const employee_id = request.params.employee_id;

    const result = await leaveBalanceModel(employee_id);
    if (result.length > 0) {
      console.log(result,"ok")
      return h
        .response({
          message: "leave balance data available",
          leaveBalance: result,
        })
        .code(200);
    } else {
      return h.response({ message: "leave balance data not available" });
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "sever error" }).code(500);
  }
};

//user see the personal details
export const personalDetails = async (request, h) => {
  try {

    const employee_id = request.params.employee_id;

    const result = await personalDetailsModel(employee_id);
    if (result.length > 0) {
      const {
        full_name,
        gender,
        martial_status,
        nationality,
        mobile_number,
        date_of_birth,
        blood_group,
        address,
      } = result[0];

      return h
        .response({
          message: "Personal details available",
          personalDetails: {
            full_name,
            gender,
            martial_status,
            nationality,
            mobile_number,
            date_of_birth,
            blood_group,
            address,
          },
        })
        .code(200);
    } else {
      return h
        .response({ message: "Personal details not available" })
        .code(404);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// // user see the job details

export const jobDetails = async (request, h) => {
  try {

    const employee_id = request.params.employee_id;

    const result = await jobDetailsModel(employee_id);

    if (result.length > 0) {
      const {
        employee_id,
        date_of_joing,
        job_title,
        worker_type,
        time_type,
        location,
        reporting_manager,
      } = result[0];
      return h
        .response({
          jobDetails: {
            employee_id,
            date_of_joing,
            job_title,
            worker_type,
            time_type,
            location,
            reporting_manager,
          },
        })
        .code(200);
    } else {
      return h.response({ message: "job details not available" }).code(404);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};
 // peers show
export const peers = async (request, h) => {
  try {
    const manager_id = request.params.manager_id;
    const result = await peersModel(manager_id);
    if (!result || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    const peersData = result.map((row) => ({
      Employee_name: row.name,
      Employee_job_title: row.job_title,
      Employee_email: row.email,
      Location: row.location,
      Gender: row.gender,
    }));

    return h.response({ peersData }).code(200);
  } catch (err) {
    console.error(err);
  }
};
