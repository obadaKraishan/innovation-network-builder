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
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          ← Back to Course Details
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Course, Module, Section, and Lesson Information */}
          <div className="mb-4">
            <h2 className="text-xl font-bold">Course: {courseTitle}</h2>
            <h3 className="text-lg font-semibold">Module: {moduleTitle}</h3>
            <h4 className="text-md font-semibold">Section: {sectionTitle}</h4>
            <h5 className="text-md font-semibold">Lesson: {lesson.lessonTitle}</h5>
          </div>

          <p>{lesson.description}</p>
          
          <div className="lesson-content">
            {/* Render lessonText as rich content */}
            {lesson.lessonText && <div dangerouslySetInnerHTML={{ __html: lesson.lessonText }} />}
            
            {lesson.materials && lesson.materials.map((material, index) => (
              <div key={index} className="flex items-center justify-between mt-4">
                {material.materialType === 'video' && (
                  <video controls className="w-full mb-4">
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
                      className="bg-green-500 text-white py-2 px-4 rounded flex items-center"
                    >
                      <FaEye className="mr-2" /> View {material.title}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons mt-6 flex justify-between">
            <button
              onClick={goToPreviousLesson}
              disabled={!previousLessonId} // Disable button if there's no previous lesson
              className={`bg-blue-500 text-white py-2 px-4 rounded flex items-center ${!previousLessonId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaChevronLeft className="mr-2" /> Previous Lesson
            </button>

            <button
              onClick={goToNextLesson}
              disabled={!nextLessonId} // Disable button if there's no next lesson
              className={`bg-blue-500 text-white py-2 px-4 rounded flex items-center ${!nextLessonId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next Lesson <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessonViewer;
