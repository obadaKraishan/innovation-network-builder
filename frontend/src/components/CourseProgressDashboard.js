import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseProgressDashboard = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await api.get('/courses/progress');
        setProgress(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load progress');
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div>Loading progress...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Employee Course Progress</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Course Title</th>
                <th className="px-4 py-2">Progress</th>
                <th className="px-4 py-2">Completion Status</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((entry, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{entry.employeeName}</td>
                  <td className="border px-4 py-2">{entry.courseTitle}</td>
                  <td className="border px-4 py-2">{entry.progressPercentage}%</td>
                  <td className="border px-4 py-2">
                    {entry.isCompleted ? 'Completed' : 'In Progress'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressDashboard;
