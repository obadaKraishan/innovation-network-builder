import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses/manage');
        setCourses(data);
        setFilteredCourses(data); // Initially display all courses
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle live search
  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Manage Courses</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
            onClick={() => window.location.href = '/create-course'} // Navigate to the create course page
          >
            Create New Course
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Search courses by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Course Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Enrolled Employees</th>
                <th className="px-4 py-2">Completion Rate</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{course.title}</td>
                  <td className="border px-4 py-2">{course.description}</td>
                  <td className="border px-4 py-2">{course.enrolledEmployees?.length || 0}</td>
                  <td className="border px-4 py-2">{course.completionRate || 0}%</td>
                  <td className="border px-4 py-2">
                    {/* Edit Course Button */}
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded shadow mr-2"
                      onClick={() => window.location.href = `/edit-course/${course._id}`}
                    >
                      Edit
                    </button>
                    {/* View More Details */}
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded shadow"
                      onClick={() => window.location.href = `/course-details/${course._id}`}
                    >
                      View Details
                    </button>
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

export default CourseManagement;
