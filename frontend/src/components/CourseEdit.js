// File: frontend/src/components/CourseEdit.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    image: '',
    estimatedDuration: 0,
    courseRequirements: '',
    objectives: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (error) {
        toast.error('Failed to load course details');
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await api.put(`/courses/${id}`, course);
      toast.success('Course updated successfully!');
      navigate('/course-management');
    } catch (error) {
      toast.error('Error updating course');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Course Title"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Course Description"
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={course.image}
          onChange={(e) => setCourse({ ...course, image: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Estimated Duration (hours)"
          value={course.estimatedDuration}
          onChange={(e) => setCourse({ ...course, estimatedDuration: Number(e.target.value) })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Course Requirements"
          value={course.courseRequirements}
          onChange={(e) => setCourse({ ...course, courseRequirements: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Objectives"
          value={course.objectives}
          onChange={(e) => setCourse({ ...course, objectives: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CourseEdit;
