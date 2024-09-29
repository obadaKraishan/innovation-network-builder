import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaSave } from 'react-icons/fa';
import api from '../utils/api';
import CourseImageUpload from './CourseImageUpload';
import CourseQuizForm from './CourseQuizForm';
import CourseMaterialUpload from './CourseMaterialUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ReactQuill styling

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState([
    {
      moduleTitle: '',
      sections: [
        {
          sectionTitle: '',
          lessons: [
            {
              lessonTitle: '',
              lessonText: '', // Add lessonText for rich content
              materials: [],
              quiz: [],
            },
          ],
        },
      ],
    },
  ]);
  const [courseImage, setCourseImage] = useState(null);
  const [skillsGained, setSkillsGained] = useState(['']);
  const [courseRequirements, setCourseRequirements] = useState(['']);
  const [objectives, setObjectives] = useState('');

  // Handle adding new module
  const addModule = () => {
    setModules([
      ...modules,
      {
        moduleTitle: '',
        sections: [
          {
            sectionTitle: '',
            lessons: [
              {
                lessonTitle: '',
                lessonText: '', // Initialize lessonText for new lesson
                materials: [],
                quiz: [],
              },
            ],
          },
        ],
      },
    ]);
  };

  // Handle adding new section in a module
  const addSection = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].sections.push({
      sectionTitle: '',
      lessons: [
        {
          lessonTitle: '',
          lessonText: '', // Initialize lessonText for new section
          materials: [],
          quiz: [],
        },
      ],
    });
    setModules(updatedModules);
  };

  // Handle adding new lesson in a section
  const addLesson = (moduleIndex, sectionIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].sections[sectionIndex].lessons.push({
      lessonTitle: '',
      lessonText: '', // Initialize lessonText for new lesson
      materials: [],
      quiz: [],
    });
    setModules(updatedModules);
  };

  // Handle saving the course
  const saveCourse = async () => {
    try {
      const newCourse = {
        title,
        description,
        modules,
        courseImage,
        skillsGained,
        courseRequirements,
        objectives,
      };

      const { data } = await api.post('/courses/create', newCourse);
      toast.success('Course created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setModules([
        {
          moduleTitle: '',
          sections: [
            {
              sectionTitle: '',
              lessons: [
                {
                  lessonTitle: '',
                  lessonText: '', // Reset lessonText for new lesson
                  materials: [],
                  quiz: [],
                },
              ],
            },
          ],
        },
      ]);
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
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Course Description</label>
              <textarea
                value={description || ''}
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
                value={skill || ''}
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
            {modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-4 bg-gray-100 p-4 rounded">
                <label className="block text-sm font-bold mb-2">Module {moduleIndex + 1}</label>
                <input
                  type="text"
                  value={module.moduleTitle}
                  onChange={(e) => {
                    const newModules = [...modules];
                    newModules[moduleIndex].moduleTitle = e.target.value;
                    setModules(newModules);
                  }}
                  className="w-full p-3 mb-2 border border-gray-300 rounded"
                  placeholder="Module Title"
                />

                {/* Sections */}
                {module.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="ml-6 mb-4">
                    <label className="block text-sm font-bold mb-2">Section {sectionIndex + 1}</label>
                    <input
                      type="text"
                      value={section.sectionTitle}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules[moduleIndex].sections[sectionIndex].sectionTitle =
                          e.target.value;
                        setModules(newModules);
                      }}
                      className="w-full p-3 mb-2 border border-gray-300 rounded"
                      placeholder="Section Title"
                    />

                    {/* Lessons */}
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="ml-12 mb-4">
                        <label className="block text-sm font-bold mb-2">Lesson {lessonIndex + 1}</label>
                        <input
                          type="text"
                          value={lesson.lessonTitle}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[moduleIndex].sections[sectionIndex].lessons[
                              lessonIndex
                            ].lessonTitle = e.target.value;
                            setModules(newModules);
                          }}
                          className="w-full p-3 mb-2 border border-gray-300 rounded"
                          placeholder="Lesson Title"
                        />

                        {/* Lesson Text Editor */}
                        <ReactQuill
                          value={section.lessons[lessonIndex].lessonText || ''}
                          onChange={(content) => {
                            const updatedModules = [...modules];
                            updatedModules[moduleIndex].sections[sectionIndex].lessons[lessonIndex].lessonText = content;
                            setModules(updatedModules);
                          }}
                        />

                        {/* Materials */}
                        <CourseMaterialUpload
                          moduleIndex={moduleIndex}
                          sectionIndex={sectionIndex}
                          lessonIndex={lessonIndex}
                          modules={modules}
                          setModules={setModules}
                        />

                        {/* Quiz */}
                        <CourseQuizForm
                          moduleIndex={moduleIndex}
                          sectionIndex={sectionIndex}
                          lessonIndex={lessonIndex}
                          modules={modules}
                          setModules={setModules}
                        />

                        {/* Display Added Quizzes */}
                        {section.lessons[lessonIndex].quiz.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-bold">Added Quizzes:</h5>
                            <ul>
                              {section.lessons[lessonIndex].quiz.map((quiz, quizIndex) => (
                                <li key={quizIndex}>
                                  <strong>{quiz.quizTitle}</strong>
                                  <ul>
                                    {quiz.questions.map((question, questionIndex) => (
                                      <li key={questionIndex}>
                                        {question.label} (Type: {question.type})
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex, sectionIndex)}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      Add New Lesson
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSection(moduleIndex)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Add New Section
                </button>
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
