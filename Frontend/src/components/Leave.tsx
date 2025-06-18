import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import {useFormik} from 'formik';
import * as Yup from "yup";

type FormData = {
  employee_id: string;
  startDate: string;
  endDate: string;
  leaveId: number;
  reason: string;
};

type DisabledRange = {
  start_date: string;
  end_date: string;
};

type HolidayByType = {
  floater:{ date: string; name: string }[];
  [key: string]: any; 
};

type Leave_Balance = {
  total_leave: number;
  name: string;
  id:number;
};

interface LeaveFormProps {
  leaveBalance: Leave_Balance[];
}


const LeaveForm: React.FC<LeaveFormProps> = ({ leaveBalance }) => {

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast: HTMLElement) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  const [disabledRanges, setDisabledRanges] = useState<DisabledRange[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    historyDate();
    const token = localStorage.getItem('token')!;
    fetchHolidays(token);
  }, []);

  const [holidayList, setHolidayList] = useState<HolidayByType>({
    floater: [],
  })
  const fetchHolidays = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/holidaysShow', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      
      setHolidayList(result);
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };


  const historyDate = async () => {
    try {
      setIsLoadingHistory(true);
      const token = localStorage.getItem("token")!;
      const employee_id = localStorage.getItem("employee_id")!;


      const response = await fetch(`http://localhost:5000/api/leave-date-history/${employee_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (Array.isArray(result.data)) {
        setDisabledRanges(result.data);
      } else {
        console.warn("Unexpected data format:", result);
      }
    } catch (err) {
      console.error("Error fetching leave history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const dateCheker = (startDate: string, endDate: string): boolean => {
    const s1 = new Date(formatDate(new Date(startDate)));
    const e1 = new Date(formatDate(new Date(endDate)));
  
    for (const range of disabledRanges) {
      const s2 = new Date(formatDate(new Date(range.start_date)));
      const e2 = new Date(formatDate(new Date(range.end_date)));
  
      const isOverlapping = s1 <= e2 && e1 >= s2;
  
      if (isOverlapping) {
        return true;
      }
    }
  
    return false;
  };
  


  const request = async (formData: FormData) => {
    console.log("Submitting with", formData);
    if (isLoadingHistory) {
      alert("Leave history is still loading. Please wait...");
      
      return;
    }

    const dateConflict = dateCheker(values.startDate, values.endDate);
    if (dateConflict) {
      Swal.fire({
        title: " Check the Date",
        text: "These dates are already covered by previous leave. Kindly choose alternative dates.",
        icon: "question"
      });
      return;
    }

    if (values.leaveId === 4) {
      const start = dayjs(values.startDate).format('YYYY-MM-DD');
      const end = dayjs(values.endDate).format('YYYY-MM-DD');
    
      const isFloaterHoliday = holidayList.floater.some((holiday) => {
        const floaterDate = dayjs(holiday.date).format('YYYY-MM-DD');
        return floaterDate === start || floaterDate === end;
      });
    
      if (!isFloaterHoliday) {
        alert("Please select a valid floater holiday date.");
        return;
      }
    }
 

  const token = localStorage.getItem("token")!;


  try {
    const response = await fetch("http://localhost:5000/api/leave-request", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData:formData }),
      credentials: "include",
    });

    const result = await response.json();

    if (result.message === "leave request created") {
      Toast.fire({
        icon: "success",
        title: result.message
      });
     
      window.location.reload();
    }else if(result.message === "Check leave balance"){ 
      Swal.fire({
        title: "Check",
        text: result.message,
        icon: "warning"
      });
       } 
    else {
      console.log("Failed to create leave request:", result);
      Swal.fire({
        title: "Fail",
        text: result.message,
        icon: "warning"
      });
    }
  } catch (err) {
    console.error("Error submitting request:", err);
  }
};
const employeeId = localStorage.getItem("employee_id") || "";



  const {values, handleBlur, handleChange, handleSubmit,touched,  errors} = useFormik({
    enableReinitialize: true,
    initialValues: {
      employee_id: employeeId || "",
      startDate: "",
      endDate: "",
      leaveId: 0,
      reason: "",
    },
    
    validationSchema: Yup.object({
      employee_id: Yup.string().required("Employee ID is required"),
    
      startDate: Yup.date()
        .required("Start date is required"),
    
      endDate: Yup.date()
        .required("End date is required")
        .test(
          "is-same-or-after",
          "End date must be same or after start date",
          function (value) {
            const { startDate } = this.parent;
            return value && startDate ? new Date(value) >= new Date(startDate) : true;
          }
        ),
    
      leaveId: Yup.number()
        .min(1, "Leave type is required"),
    
      reason: Yup.string()
        .min(8, "Please use at least 8 characters")
        .required("Reason is required"),
    }),
    

    onSubmit:  async (values) => {
      console.log("Form submitted with:", values);
      await request(values); 
    },
    
  });

  
  return (
    <div className="h-[54vh] w-fit bg-white py-0 px-0 text-black flex flex-col justify-between overflow-y-auto" id="rScroll">
      <form onSubmit={handleSubmit} className="h-[48vh] my-5 place-items-center flex flex-col justify-around text-[17px]">
        <div className="flex">
          <div className="w-[155px] h-fit">
            <label>Start</label>
            <input
              type="date"
              name="startDate"
              className={`border-2 rounded-lg px-2 w-[150px] focus:outline-none ${errors.startDate && touched.startDate ? 'border-red-500' : 'border-gray-300'}`}
              value={values.startDate}
              // onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              onChange={handleChange}
              onBlur={handleBlur}
              />
          </div>
          <div className="w-[155px] h-fit">
            <label>End</label>
            <input
              type="date"
              name="endDate"
              className={`border-2 rounded-lg px-2 w-[150px] focus:outline-none ${errors.endDate && touched.endDate ? 'border-red-500' : 'border-gray-300'}`}
              value={values.endDate}
              // onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              onChange={handleChange}
              onBlur={handleBlur}
              />
          </div>
        </div>

        <div className="px-7 flex flex-col">
          <label htmlFor="leaveId" className="my-2">Select leave type</label>
          <select
  name="leaveId"
  id="leaveId"
  className={`w-[300px] border-2 py-2 px-2 rounded-lg focus:outline-none ${
    errors.leaveId && touched.leaveId ? 'border-red-500' : 'border-gray-300'
  }`}
  value={values.leaveId}
  onChange={handleChange}
  onBlur={handleBlur}
>
  <option value="0" disabled selected>
    Choose
  </option>
  {leaveBalance.map((data, index) => (
    <option key={data.id || index} value={data.id || index + 1}>
      {data.name}
    </option>
  ))}
</select>

        </div>

        <div className="px-7 flex flex-col">
          <label htmlFor="reason" className="my-2">Reason</label>
          <textarea
            placeholder="Type your Reason"
            name="reason"
            className={`w-[300px] h-[100px] border-2 py-2 px-2 border-black rounded-lg focus:outline-none resize-none ${errors.reason && touched.reason ? 'border-red-500' : 'border-gray-300'}` }
            value={values.reason}
            // onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
            onChange={handleChange}
            onBlur={handleBlur}

            />
        </div>

        <div className="flex justify-end w-[19vw] mt-5">
          <button
            type="submit"
            className="text-white bg-[#6a77f9] px-2 py-2 rounded-lg text-[15px] w-fit"
            style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-check"></i> Request
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeaveForm;
