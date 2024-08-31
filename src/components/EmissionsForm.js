import { useState } from 'react';

export default function EmissionsForm() {
  const [data, setData] = useState({
    excavation: '',
    transportation: '',
    equipment: '',
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Excavation</label>
        <input
          type="text"
          name="excavation"
          value={data.excavation}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Transportation</label>
        <input
          type="text"
          name="transportation"
          value={data.transportation}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Equipment Usage</label>
        <input
          type="text"
          name="equipment"
          value={data.equipment}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Estimate Emissions
      </button>
    </form>
  );
}
