import React, { useEffect, useState, useContext } from 'react';
import Sidebar from './Sidebar'; 
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const PersonalizedRecommendations = () => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({ employeeId: '', text: '', url: '' });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployeesAndRecommendations = async () => {
      try {
        const [empRes, recRes] = await Promise.all([
          api.get('/wellness/employees'), // Assuming this API fetches employees
          api.get(`/wellness/recommendations/${user._id}`),
        ]);
        setEmployees(empRes.data);
        setRecommendations(recRes.data);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };

    fetchEmployeesAndRecommendations();
  }, [user]);

  const handleAddRecommendation = async () => {
    try {
      const { data } = await api.post('/wellness/recommendations', newRecommendation);
      setRecommendations([...recommendations, data]);
      toast.success('Recommendation added successfully');
    } catch (error) {
      toast.error('Failed to add recommendation');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Personalized Wellness Recommendations</h1>

          {/* Admin can add new recommendations */}
          {['CEO', 'Manager'].includes(user.role) && (
            <div className="mb-6">
              <h2 className="text-xl">Add New Recommendation</h2>
              <select value={newRecommendation.employeeId} onChange={(e) => setNewRecommendation({ ...newRecommendation, employeeId: e.target.value })}>
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
              <textarea value={newRecommendation.text} onChange={(e) => setNewRecommendation({ ...newRecommendation, text: e.target.value })} placeholder="Recommendation Text" />
              <input type="url" placeholder="Resource URL (Optional)" value={newRecommendation.url} onChange={(e) => setNewRecommendation({ ...newRecommendation, url: e.target.value })} />
              <button onClick={handleAddRecommendation}>Add Recommendation</button>
            </div>
          )}

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gray-100 shadow rounded-lg">
                <h2 className="text-xl font-bold">Recommendation {index + 1}</h2>
                <p>{rec.recommendationText}</p>
                {rec.resourceUrl && <a href={rec.resourceUrl} className="text-blue-500 hover:underline">View Related Resource</a>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
