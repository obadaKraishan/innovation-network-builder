import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses/manage');
        setCourses(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Course Title</th>
                <th className="px-4 py-2">Enrolled Employees</th>
                <th className="px-4 py-2">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{course.title}</td>
                  <td className="border px-4 py-2">{course.enrolledEmployees}</td>
                  <td className="border px-4 py-2">{course.completionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
