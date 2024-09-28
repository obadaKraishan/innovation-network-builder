import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseLessonViewer = () => {
  const { courseId, moduleId, sectionId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [previousLesson, setPreviousLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        // Fetch full course details
        const { data: courseData } = await api.get(`/courses/${courseId}`);
        setCourseTitle(courseData.title);

        // Get current module and section
        const module = courseData.modules.find(mod => mod._id === moduleId);
        setModuleTitle(module.moduleTitle);
        const section = module.sections.find(sec => sec._id === sectionId);
        setSectionTitle(section.sectionTitle);

        // Fetch current lesson
        const { data: lessonData } = await api.get(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${lessonId}`);
        setLesson(lessonData.lesson);

        // Determine previous and next lessons in the entire course
        const allLessons = getAllLessons(courseData.modules);
        const currentLessonIndex = allLessons.findIndex(lesson => lesson._id === lessonId);

        setPreviousLesson(allLessons[currentLessonIndex - 1] || null);
        setNextLesson(allLessons[currentLessonIndex + 1] || null);
      } catch (error) {
        toast.error('Failed to load lesson details');
      }
    };

    fetchLessonDetails();
  }, [courseId, moduleId, sectionId, lessonId]);

  // Helper function to flatten all lessons across modules and sections
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

  const goToNextLesson = () => {
    if (nextLesson) {
      navigate(`/courses/${courseId}/module/${nextLesson.moduleId}/section/${nextLesson.sectionId}/lesson/${nextLesson._id}`);
    }
  };

  const goToPreviousLesson = () => {
    if (previousLesson) {
      navigate(`/courses/${courseId}/module/${previousLesson.moduleId}/section/${previousLesson.sectionId}/lesson/${previousLesson._id}`);
    }
  };

  const goBackToCourseDetails = () => {
    navigate(`/courses/${courseId}`);
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <button
          onClick={goBackToCourseDetails}
          className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          ← Back to Course Details
        </button>

        <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-800">Course: {courseTitle}</h2>
            <h3 className="text-xl font-semibold text-gray-700">Module: {moduleTitle}</h3>
            <h4 className="text-lg font-semibold text-gray-600">Section: {sectionTitle}</h4>
            <h5 className="text-lg font-semibold text-gray-600">Lesson: {lesson.lessonTitle}</h5>
          </div>

          <p className="text-gray-700 leading-relaxed">{lesson.description}</p>

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
