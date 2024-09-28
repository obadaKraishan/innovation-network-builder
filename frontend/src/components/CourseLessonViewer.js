import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Add FaEye for the button and navigation icons
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseLessonViewer = () => {
  const { courseId, moduleId, sectionId, lessonId } = useParams(); // These are now ObjectIds
  const [lesson, setLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState(""); // Track the course title
  const [moduleTitle, setModuleTitle] = useState(""); // Track the module title
  const [sectionTitle, setSectionTitle] = useState(""); // Track the section title
  const [previousLessonId, setPreviousLessonId] = useState(null); // Track the previous lesson ID
  const [nextLessonId, setNextLessonId] = useState(null); // Track the next lesson ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        // Fetch course details, including module and section titles
        const { data: courseData } = await api.get(`/courses/${courseId}`);
        setCourseTitle(courseData.title);

        const module = courseData.modules.find((mod) => mod._id === moduleId);
        setModuleTitle(module.moduleTitle);

        const section = module.sections.find((sec) => sec._id === sectionId);
        setSectionTitle(section.sectionTitle);

        // Fetch lesson details and the IDs of the previous and next lessons
        const { data } = await api.get(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${lessonId}`);
        setLesson(data.lesson);
        setPreviousLessonId(data.previousLessonId);
        setNextLessonId(data.nextLessonId);
      } catch (error) {
        toast.error('Failed to load lesson details');
      }
    };

    fetchLessonDetails();
  }, [courseId, moduleId, sectionId, lessonId]);

  const goToNextLesson = () => {
    if (nextLessonId) {
      navigate(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${nextLessonId}`);
    }
  };

  const goToPreviousLesson = () => {
    if (previousLessonId) {
      navigate(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${previousLessonId}`);
    }
  };

  // Back to Course Details button
  const goBackToCourseDetails = () => {
    navigate(`/courses/${courseId}`);
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Back Button */}
        <button
          onClick={goBackToCourseDetails}
          className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          ← Back to Course Details
        </button>

        <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          {/* Course, Module, Section, and Lesson Information */}
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-800">Course: {courseTitle}</h2>
            <h3 className="text-xl font-semibold text-gray-700">Module: {moduleTitle}</h3>
            <h4 className="text-lg font-semibold text-gray-600">Section: {sectionTitle}</h4>
            <h5 className="text-lg font-semibold text-gray-600">Lesson: {lesson.lessonTitle}</h5>
          </div>

          <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
          
          <div className="lesson-content space-y-6">
            {/* Render lessonText as rich content */}
            {lesson.lessonText && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.lessonText }} />}
            
            {lesson.materials && lesson.materials.map((material, index) => (
              <div key={index} className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                {material.materialType === 'video' && (
                  <video controls className="w-full rounded-lg mb-4">
                    <source src={material.materialUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {material.materialType === 'pdf' && (
                  <div className="flex items-center">
                    <a
                      href={material.materialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700 transition-all flex items-center"
                    >
                      <FaEye className="mr-2" /> View {material.title}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons mt-6 flex justify-between space-x-4">
            <button
              onClick={goToPreviousLesson}
              disabled={!previousLessonId} // Disable button if there's no previous lesson
              className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 ${!previousLessonId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition-all'}`}
            >
              <FaChevronLeft /> <span>Previous Lesson</span>
            </button>

            <button
              onClick={goToNextLesson}
              disabled={!nextLessonId} // Disable button if there's no next lesson
              className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 ${!nextLessonId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition-all'}`}
            >
              <span>Next Lesson</span> <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessonViewer;
