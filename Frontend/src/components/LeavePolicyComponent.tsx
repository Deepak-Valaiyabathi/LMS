import { useState, useEffect, MouseEvent } from "react";

interface LeavePolicy {
  id: number;
  employee_type_id: string;
  leave_type_id: string;
  max_days_per_year: number;
  name: string;
  accrual_per_month: number;
}

interface LeavePolicyForm {
  employee_type_id: number;
  leave_type_id: number;
  max_days_per_year: number;
  name: string;
  accrual_per_month: number;
}
interface EmployeeTypesProps {
    setLPForm: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const LeavePolicyComponent: React.FC<EmployeeTypesProps> = ({ setLPForm }) => {
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState(""); // You should get this from your auth context

  const [addLeavePolicy, setAddLeavePolicy] = useState<LeavePolicyForm>({
    employee_type_id: 0,
    leave_type_id: 0,
    max_days_per_year: 0,
    name: "",
    accrual_per_month: 0,
  });

  useEffect(() => {
    // Fetch token from storage or context
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchLeavePolicies(storedToken);
    }
  }, []);

  const fetchLeavePolicies = async (authToken: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/leave-policies", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch leave policies");
      }
      
      const data = await response.json();
      console.log(data)
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const leavePolicyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setAddLeavePolicy((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseInt(value) : 0) : value,
    }));
  };

  const LeavePolicyHandle = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/leave-policy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addLeavePolicy),
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (result.message === 'leave policy added') {
        alert(result.message);
        setIsFormOpen(false);
        fetchLeavePolicies(token);
        // Reset form
        setAddLeavePolicy({
          employee_type_id: 0,
          leave_type_id: 0,
          max_days_per_year: 0,
          name: "",
          accrual_per_month: 0,
        });
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add leave policy");
    }
  };


  return (
    <div className="container mx-auto p-6 bg-white h-[85vh] w-fit overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
      <button className='bg-[#6a77f9] text-white rounded-lg px-2 py-2 gont-medium' onClick={()=>setLPForm((prev)=>!prev)}>Back</button>
      <h1 className="text-2xl font-bold text-gray-800">Leave Policies</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#6a77f9] hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
        >
          Add Leave Policy
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Days/Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accrual/Month</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.employee_type_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.leave_type_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.max_days_per_year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.accrual_per_month}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <>
           <div className="flex justify-between items-center mb-4 mt-10">
                <h2 className="text-xl font-semibold text-gray-800">Add Leave Policy</h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
                  <select
                    name="employee_type_id"
                    onChange={leavePolicyChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={addLeavePolicy.employee_type_id}
                  >
                    <option value="0">Select Employee Type</option>
                    <option value="1">Developer</option>
                    <option value="2">HR</option>
                    <option value="5">Intern</option>
                    <option value="3">Manager</option>
                    <option value="4">Director</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    name="leave_type_id"
                    onChange={leavePolicyChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={addLeavePolicy.leave_type_id}
                  >
                    <option value="0">Select Leave Type</option>
                    <option value="1">Sick</option>
                    <option value="2">Casual</option>
                    <option value="3">Planned</option>
                    <option value="4">Floater</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Policy Name"
                    onChange={leavePolicyChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={addLeavePolicy.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Days Per Year</label>
                  <input
                    name="max_days_per_year"
                    type="number"
                    placeholder="Maximum days per year"
                    onChange={leavePolicyChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={addLeavePolicy.max_days_per_year || ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accrual Per Month</label>
                  <input
                    name="accrual_per_month"
                    type="number"
                    placeholder="Accrual Per Month"
                    onChange={leavePolicyChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={addLeavePolicy.accrual_per_month || ""}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={LeavePolicyHandle}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6a77f9] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
        </>
           
      )}
    </div>
  );
}
export default LeavePolicyComponent;