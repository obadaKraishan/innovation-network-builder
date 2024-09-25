import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaSave } from 'react-icons/fa';
import api from '../utils/api';
import CourseImageUpload from './CourseImageUpload';
import CourseQuizForm from './CourseQuizForm';
import CourseMaterialUpload from './CourseMaterialUpload';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState([]);
  const [courseImage, setCourseImage] = useState(null); // For image upload
  const [skillsGained, setSkillsGained] = useState(['']);
  const [courseRequirements, setCourseRequirements] = useState(['']);
  const [objectives, setObjectives] = useState('');

  // Handle adding new module
  const addModule = () => {
    setModules([...modules, { moduleTitle: '', sections: [] }]);
  };

  // Handle saving the course
  const saveCourse = async () => {
    try {
      const newCourse = {
        title,
        description,
        modules,
        courseImage, // Will handle image upload logic in CourseImageUpload.js
        skillsGained,
        courseRequirements,
        objectives,
      };

      const { data } = await api.post('/courses/create', newCourse);
      toast.success('Course created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setModules([]);
      setCourseImage(null);
      setSkillsGained(['']);
      setCourseRequirements(['']);
      setObjectives('');
    } catch (error) {
      toast.error('Error creating course');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaPlusCircle className="mr-2" /> Create New Course
          </h2>
        </div>

        <div className="bg-white shadow-md rounded p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Course Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
              ></textarea>
            </div>
          </div>

          {/* Course Image Upload */}
          <CourseImageUpload setCourseImage={setCourseImage} />

          {/* Skills Gained */}
          <div className="mt-6">
            <label className="block text-gray-700">Skills Gained</label>
            {skillsGained.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => {
                  const newSkills = [...skillsGained];
                  newSkills[index] = e.target.value;
                  setSkillsGained(newSkills);
                }}
                className="w-full p-3 mb-2 border border-gray-300 rounded"
              />
            ))}
            <button
              type="button"
              onClick={() => setSkillsGained([...skillsGained, ''])}
              className="text-blue-500 hover:underline"
            >
              Add another skill
            </button>
          </div>

          {/* Course Requirements */}
          <div className="mt-6">
            <label className="block text-gray-700">Course Requirements</label>
            {courseRequirements.map((requirement, index) => (
              <input
                key={index}
                type="text"
                value={requirement}
                onChange={(e) => {
                  const newRequirements = [...courseRequirements];
                  newRequirements[index] = e.target.value;
                  setCourseRequirements(newRequirements);
                }}
                className="w-full p-3 mb-2 border border-gray-300 rounded"
              />
            ))}
            <button
              type="button"
              onClick={() => setCourseRequirements([...courseRequirements, ''])}
              className="text-blue-500 hover:underline"
            >
              Add another requirement
            </button>
          </div>

          {/* Objectives */}
          <div className="mt-6">
            <label className="block text-gray-700">Course Objectives</label>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            ></textarea>
          </div>

          {/* Modules */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Modules</h3>
            {modules.map((module, index) => (
              <div key={index} className="mb-4 bg-gray-100 p-4 rounded">
                <input
                  type="text"
                  value={module.moduleTitle}
                  onChange={(e) => {
                    const newModules = [...modules];
                    newModules[index].moduleTitle = e.target.value;
                    setModules(newModules);
                  }}
                  className="w-full p-3 mb-2 border border-gray-300 rounded"
                  placeholder="Module Title"
                />
                <CourseMaterialUpload moduleIndex={index} modules={modules} setModules={setModules} />
                <CourseQuizForm moduleIndex={index} modules={modules} setModules={setModules} />
              </div>
            ))}

            <button
              type="button"
              onClick={addModule}
              className="text-blue-500 hover:underline mt-2"
            >
              Add New Module
            </button>
          </div>

          {/* Save Course Button */}
          <button
            type="button"
            onClick={saveCourse}
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded flex justify-center items-center"
          >
            <FaSave className="mr-2" /> Save Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
