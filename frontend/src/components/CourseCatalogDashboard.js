import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CourseCatalogDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        toast.error('Failed to load courses');
      }
    };
    fetchCourses();
  }, []);

  // Filter courses based on the filter
  useEffect(() => {
    if (filter) {
      setFilteredCourses(courses.filter((course) => course.skillsGained.includes(filter)));
    } else {
      setFilteredCourses(courses);
    }
  }, [filter, courses]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Course Catalog</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Filter by Skill</label>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter skill to filter"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <p className="text-gray-500">Skills: {course.skillsGained.join(', ')}</p>
              <p className="text-gray-500">Duration: {course.estimatedDuration} hours</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalogDashboard;
