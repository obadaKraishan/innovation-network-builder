// File: frontend/src/components/CourseEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineSave, AiOutlineRollback } from 'react-icons/ai';
import api from '../utils/api';
import Sidebar from './Sidebar';

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    image: '',
    estimatedDuration: 0,
    skillsGained: [],
    courseRequirements: [],
    objectives: '',
    modules: [
      {
        moduleTitle: '',
        sections: [
          {
            sectionTitle: '',
            lessons: [
              { lessonTitle: '', lessonType: 'text', videoUrl: '', textContent: '' },
            ],
          },
        ],
      },
    ],
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

  // Helper function to handle array updates (e.g., skillsGained, courseRequirements)
  const handleArrayChange = (field, index, value) => {
    const newArray = [...course[field]];
    newArray[index] = value;
    setCourse({ ...course, [field]: newArray });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold">Edit Course</h2>
          <button
            onClick={() => navigate('/course-management')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow flex items-center"
          >
            <AiOutlineRollback className="mr-2" />
            Cancel
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2">Course Title</label>
            <input
              type="text"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter course title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter course description"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold mb-2">Image URL</label>
            <input
              type="text"
              value={course.image}
              onChange={(e) => setCourse({ ...course, image: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter image URL"
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-sm font-bold mb-2">Estimated Duration (hours)</label>
            <input
              type="number"
              value={course.estimatedDuration}
              onChange={(e) => setCourse({ ...course, estimatedDuration: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter estimated duration"
            />
          </div>

          {/* Skills Gained */}
          <div>
            <label className="block text-sm font-bold mb-2">Skills Gained</label>
            {course.skillsGained.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange('skillsGained', index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Enter skill"
              />
            ))}
          </div>

          {/* Course Requirements */}
          <div>
            <label className="block text-sm font-bold mb-2">Course Requirements</label>
            {course.courseRequirements.map((requirement, index) => (
              <input
                key={index}
                type="text"
                value={requirement}
                onChange={(e) => handleArrayChange('courseRequirements', index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Enter requirement"
              />
            ))}
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-bold mb-2">Objectives</label>
            <textarea
              value={course.objectives}
              onChange={(e) => setCourse({ ...course, objectives: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter objectives"
            />
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow flex items-center"
            >
              <AiOutlineSave className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;
