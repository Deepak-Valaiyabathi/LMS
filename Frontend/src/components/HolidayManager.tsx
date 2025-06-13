import React, { useEffect, useState, MouseEvent, ChangeEvent } from "react";

interface Holiday {
    id: number;
    date: string;
    name: string;
    type: string;
    createdAt: string;
  }
  
  interface EmployeeTypesProps {
    setHForm: React.Dispatch<React.SetStateAction<boolean>>;
  }

const HolidayManager: React.FC<EmployeeTypesProps> = ({ setHForm }) =>{
  const token = localStorage.getItem("token") || "";

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    holidayDate: "",
    holidayName: "",
    type: "",
  });

  // Fetch holidays on mount or when form submits
  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/holidaysShow", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
  
      // Flatten grouped data and add `type` to each item
      const flatData: Holiday[] = Object.entries(data).flatMap(
        ([type, holidays]) =>
          (holidays as Holiday[]).map((h) => ({
            ...h,
            type,
          }))
      );
  console.log(flatData)
      setHolidays(flatData);
    } catch (err) {
      setError("Failed to fetch holidays");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/holiday", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await response.json();
      if (result.message === "holiday added") {
        alert(result.message);
        setShowForm(false);
        setFormData({ holidayDate: "", holidayName: "", type: "" });
        fetchHolidays(); // Refresh list
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting holiday");
    }
  };

  return (
    <div className="p-6 bg-white w-fit max-h-[80vh] place-items-center overflow-y-auto">
      <div className="flex justify-between gap-10 items-center mb-4">
        <button className="px-2 py-2 text-white rounded-lg bg-[#6a77f9]" onClick={()=>setHForm((prev)=>!prev)}>back</button>
        <h1 className="text-2xl font-semibold">Holiday Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#6a77f9] text-white px-4 py-2 rounded"
        >
          Add Holiday
        </button>
      </div>

      {showForm && (
        <div className="mb-6 max-w-fit bg-white shadow p-4 rounded space-y-4">
          <h2 className="text-xl font-semibold text-center">Add Holiday</h2>
          <input
            name="holidayDate"
            type="date"
            value={formData.holidayDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="holidayName"
            type="text"
            placeholder="Holiday Name"
            value={formData.holidayName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="Public">Public</option>
            <option value="National">National</option>
            <option value="Normal">Floater</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border rounded"
              onClick={() => setShowForm(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="bg-[#6a77f9] text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Loading holidays...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-2 text-left border">#</th>
      <th className="px-4 py-2 text-left border">Date</th>
      <th className="px-4 py-2 text-left border">Name</th>
      <th className="px-4 py-2 text-left border">Type</th>
      <th className="px-4 py-2 text-left border">Created At</th>
    </tr>
  </thead>
  <tbody>
    {holidays.map((h, index) => (
      <tr key={h.id} className="hover:bg-gray-50">
        <td className="px-4 py-2 border">{index + 1}</td>
        <td className="px-4 py-2 border">
          {new Date(h.date).toLocaleDateString()}
        </td>
        <td className="px-4 py-2 border">{h.name}</td>
        <td className="px-4 py-2 border capitalize">{h.type}</td>
        <td className="px-4 py-2 border">
          {new Date(h.createdAt).toLocaleDateString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      )}
    </div>
  );
};

export default HolidayManager;
