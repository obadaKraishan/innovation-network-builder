import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseLessonViewer = () => {
  const { courseId, moduleId, sectionId, lessonId } = useParams(); // These are now ObjectIds
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        console.log('Fetching lesson details for courseId:', courseId, 'moduleId:', moduleId, 'sectionId:', sectionId, 'lessonId:', lessonId);
        const { data } = await api.get(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${lessonId}`);
        setLesson(data);
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
              <div key={index}>
                {material.materialType === 'video' && (
                  <video controls>
                    <source src={material.materialUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {material.materialType === 'pdf' && (
                  <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">
                    View PDF: {material.title}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons mt-6">
            <button onClick={goToPreviousLesson} className="bg-blue-500 text-white py-2 px-4 rounded mr-4">
              ← Previous Lesson
            </button>
            <button onClick={goToNextLesson} className="bg-blue-500 text-white py-2 px-4 rounded">
              Next Lesson →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessonViewer;
