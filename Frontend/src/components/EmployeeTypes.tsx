import React, {
  useState,
  ChangeEvent,
  MouseEvent,
  useEffect,
} from 'react';

interface EmployeeType {
  name: string;
  description: string;
}

interface EmployeeTypeForm {
  name: string;
  description: string;
}

interface EmployeeTypesProps {
  setETForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmployeeTypes: React.FC<EmployeeTypesProps> = ({ setETForm }) => {
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [addEmployeeType, setAddEmployeeType] = useState<EmployeeTypeForm>({
    name: '',
    description: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employee-types', {
          method:"GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data);
        setEmployeeTypes(data || []);
      } catch (err) {
        console.error('Failed to fetch employee types:', err);
      }
    };

    fetchEmployeeTypes();
  }, [token]);

  const employeeTypeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setAddEmployeeType((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : 0) : value,
    }));
  };

  const employeeTypeHandle = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/employee-type-add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addEmployeeType),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.message === 'employee type added') {
        alert(result.message);
        setEmployeeTypes((prev) => [
          ...prev,
          {
            id: result.type?.id || prev.length + 1,
            name: addEmployeeType.name,
            description: addEmployeeType.description,
          },
        ]);
        setAddEmployeeType({ name: '', description: '' });
        setShowForm(false);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg max-h-[90vh] overflow-y-scroll shadow-md w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <button className='bg-[#6a77f9] text-white rounded-lg px-2 py-2 gont-medium' onClick={()=>setETForm((prev)=>!prev)}>Back</button>
        <h2 className="text-2xl font-bold text-gray-800">Employee Types</h2>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            showForm 
              ? 'bg-gray-500 hover:bg-gray-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          } shadow-sm`}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Close' : '+ New Type'}
        </button>
      </div>

      {/* List */}
      <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 space-y-3 max-h-60 overflow-y-auto">
        {employeeTypes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No employee types found</p>
        ) : (
          employeeTypes.map((type, index) => (
            <div 
              key={index} 
              className="border border-gray-200 p-3 rounded-lg bg-white hover:bg-indigo-50 transition-colors duration-150 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-800">{type.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-100 space-y-4 animate-fade-in">
          <h1 className="text-center text-xl font-bold text-gray-800 mb-2">Add Employee Type</h1>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Type Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter type name"
              onChange={employeeTypeChange}
              value={addEmployeeType.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
              onChange={employeeTypeChange}
              value={addEmployeeType.description}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              onClick={employeeTypeHandle}
            >
              Add Type
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeTypes;