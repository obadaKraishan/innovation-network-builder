import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';
import CourseQuizSection from './CourseQuizSection'; // Import the CourseQuizSection component

const CourseLessonViewer = () => {
  // Retrieve the current course, module, section, and lesson IDs from the URL parameters
  const { courseId, moduleId, sectionId, lessonId } = useParams();
  
  // State to store the current lesson data, course title, module title, section title, and navigation for previous/next lessons
  const [lesson, setLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [moduleIndex, setModuleIndex] = useState(null);
  const [sectionIndex, setSectionIndex] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(null);
  const [previousLesson, setPreviousLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);

  // State to track if there is a quiz available
  const [quizAvailable, setQuizAvailable] = useState(false);
  const [quizId, setQuizId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        // Fetch the entire course data
        const { data: courseData } = await api.get(`/courses/${courseId}`);
        setCourseTitle(courseData.title);

        // Find the current module and section, get their indexes and titles
        const module = courseData.modules.find((mod, modIndex) => {
          if (mod._id === moduleId) {
            setModuleIndex(modIndex + 1); // Add 1 to make it user-friendly (starting from 1)
            setModuleTitle(mod.moduleTitle); // Set the module title
            return mod;
          }
          return null;
        });

        const section = module.sections.find((sec, secIndex) => {
          if (sec._id === sectionId) {
            setSectionIndex(secIndex + 1); // Add 1 to make it user-friendly
            setSectionTitle(sec.sectionTitle); // Set the section title
            return sec;
          }
          return null;
        });

        // Fetch the current lesson details
        const { data: lessonData } = await api.get(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${lessonId}`);
        setLesson(lessonData.lesson);

        // Find the current lesson index
        const currentLessonIndex = section.lessons.findIndex(lesson => lesson._id === lessonId);
        setLessonIndex(currentLessonIndex + 1); // Add 1 to make it user-friendly

        // Flatten all lessons across modules and sections for navigation
        const allLessons = getAllLessons(courseData.modules);
        const flatLessonIndex = allLessons.findIndex(lesson => lesson._id === lessonId);

        // Set the previous and next lessons based on the current lesson index
        setPreviousLesson(allLessons[flatLessonIndex - 1] || null);
        setNextLesson(allLessons[flatLessonIndex + 1] || null);

        // Check if the current lesson has a quiz available
        if (lessonData.lesson.quiz && lessonData.lesson.quiz.length > 0) {
          setQuizAvailable(true);
          setQuizId(lessonData.lesson.quiz[0]); // Store the quiz ID to pass to the quiz section
        }
      } catch (error) {
        toast.error('Failed to load lesson details');
      }
    };

    fetchLessonDetails();
  }, [courseId, moduleId, sectionId, lessonId]);

  // Helper function to flatten all lessons across all modules and sections
  const getAllLessons = (modules) => {
    const lessons = [];
    modules.forEach((mod) => {
      mod.sections.forEach((sec) => {
        sec.lessons.forEach((lesson) => {
          lessons.push({
            ...lesson,
            moduleId: mod._id,
            sectionId: sec._id,
          });
        });
      });
    });
    return lessons;
  };

  // Navigate to the next lesson if available
  const goToNextLesson = () => {
    if (nextLesson) {
      navigate(`/courses/${courseId}/module/${nextLesson.moduleId}/section/${nextLesson.sectionId}/lesson/${nextLesson._id}`);
    }
  };

  // Navigate to the previous lesson if available
  const goToPreviousLesson = () => {
    if (previousLesson) {
      navigate(`/courses/${courseId}/module/${previousLesson.moduleId}/section/${previousLesson.sectionId}/lesson/${previousLesson._id}`);
    }
  };

  // Navigate back to the course details page
  const goBackToCourseDetails = () => {
    navigate(`/courses/${courseId}`);
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar for navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Back to Course Details button */}
        <button
          onClick={goBackToCourseDetails}
          className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          ← Back to Course Details
        </button>

        <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          {/* Display Course, Module, Section, and Lesson titles and numbers */}
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-800">Course: {courseTitle}</h2>
            <h3 className="text-xl font-semibold text-gray-700">
              Module {moduleIndex}: {moduleTitle}
            </h3>
            <h4 className="text-lg font-semibold text-gray-600">
              Section {sectionIndex}: {sectionTitle}
            </h4>
            <h5 className="text-lg font-semibold text-gray-600">
              Lesson {lessonIndex}: {lesson.lessonTitle}
            </h5>
          </div>

          {/* Lesson description */}
          <p className="text-gray-700 leading-relaxed">{lesson.description}</p>

          {/* Lesson content (e.g., text, videos, materials) */}
          <div className="lesson-content space-y-6">
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

          {/* Quiz Section (embedded) */}
          {quizAvailable && quizId && (
            <div className="quiz-section mt-8">
              <h3 className="text-2xl font-bold mb-4">Take Quiz</h3>
              <CourseQuizSection courseId={courseId} quizId={quizId} />
            </div>
          )}

          {/* Navigation buttons for moving between lessons */}
          <div className="navigation-buttons mt-6 flex justify-between space-x-4">
            <button
              onClick={goToPreviousLesson}
              disabled={!previousLesson}
              className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 ${!previousLesson ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition-all'}`}
            >
              <FaChevronLeft /> <span>Previous Lesson</span>
            </button>

            <button
              onClick={goToNextLesson}
              disabled={!nextLesson}
              className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 ${!nextLesson ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition-all'}`}
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
