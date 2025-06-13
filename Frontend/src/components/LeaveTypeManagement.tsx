import { useState, useEffect } from "react";

interface LeaveType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
interface EmployeeTypesProps {
    setLTForm: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const LeaveTypeManagement: React.FC<EmployeeTypesProps> = ({ setLTForm }) => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [addLeaveType, setAddLeaveType] = useState({
    leaveName: "",
    description: "",
  });

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/leave-type-show", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leave types");
      }

      const data = await response.json();
      console.log(data)
      setLeaveTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddLeaveType(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/leave-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addLeaveType),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Leave type added successfully!");
        setIsFormOpen(false);
        setAddLeaveType({ leaveName: "", description: "" });
        fetchLeaveTypes();
      } else {
        alert(result.message || "Failed to add leave type");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add leave type");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <button className="bg-[#6a77f9] px-2 py-2 text-white rounded-lg" onClick={()=> setLTForm((prev)=>!prev)}>Back</button>
        <h1 className="text-2xl font-bold text-gray-800">Leave Types</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#6a77f9] hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Leave Type
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Leave Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {type.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {type.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {type.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(type.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Leave Type Modal */}
      {isFormOpen && (
           <>
            <div className="flex justify-between items-center mb-4 mt-10">
                <h2 className="text-xl font-semibold text-gray-800">Add New Leave Type</h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Name
                  </label>
                  <input
                    type="text"
                    name="leaveName"
                    value={addLeaveType.leaveName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={addLeaveType.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6a77f9] text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Add Leave Type
                  </button>
                </div>
              </form>
           </>
             
      )}
    </div>
  );
}
export default LeaveTypeManagement;