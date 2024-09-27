import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Add FaEye for the button and navigation icons
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseLessonViewer = () => {
  const { courseId, moduleId, sectionId, lessonId } = useParams(); // These are now ObjectIds
  const [lesson, setLesson] = useState(null);
  const [isLastLesson, setIsLastLesson] = useState(false); // State to track if it's the last lesson
  const [isFirstLesson, setIsFirstLesson] = useState(false); // State to track if it's the first lesson
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${lessonId}`);
        setLesson(data);

        // Check if it's the first or last lesson
        const lessonIndex = parseInt(lessonId, 10);
        setIsFirstLesson(lessonIndex === 1); // Disable "Previous" if first lesson
        setIsLastLesson(!data.nextLessonId); // Disable "Next" if no next lesson
      } catch (error) {
        toast.error('Failed to load lesson details');
      }
    };

    fetchLessonDetails();
  }, [courseId, moduleId, sectionId, lessonId]);

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId, 10) + 1;
    navigate(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${nextLessonId}`);
  };

  const goToPreviousLesson = () => {
    const previousLessonId = parseInt(lessonId, 10) - 1;
    navigate(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${previousLessonId}`);
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
          <h2 className="text-2xl font-bold mb-4">{lesson.lessonTitle}</h2>
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
              disabled={isFirstLesson} // Disable button if first lesson
              className={`bg-blue-500 text-white py-2 px-4 rounded flex items-center ${isFirstLesson ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaChevronLeft className="mr-2" /> Previous Lesson
            </button>

            <button
              onClick={goToNextLesson}
              disabled={isLastLesson} // Disable button if last lesson
              className={`bg-blue-500 text-white py-2 px-4 rounded flex items-center ${isLastLesson ? 'opacity-50 cursor-not-allowed' : ''}`}
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
