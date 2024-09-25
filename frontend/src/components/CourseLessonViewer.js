// File: frontend/src/components/CourseLessonViewer.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseLessonViewer = () => {
  const { courseId, moduleId, sectionId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${lessonId}`);
        setLesson(data);
      } catch (error) {
        toast.error('Failed to load lesson details');
      }
    };

    fetchLessonDetails();
  }, [courseId, moduleId, sectionId, lessonId]);

  const goToNextLesson = () => {
    // Logic to navigate to the next lesson
    const nextLessonId = parseInt(lessonId, 10) + 1; // Assuming sequential lesson IDs
    navigate(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${nextLessonId}`);
  };

  const goToPreviousLesson = () => {
    // Logic to navigate to the previous lesson
    const previousLessonId = parseInt(lessonId, 10) - 1;
    navigate(`/courses/${courseId}/module/${moduleId}/section/${sectionId}/lesson/${previousLessonId}`);
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="lesson-details">
      <h2 className="text-2xl font-bold mb-4">{lesson.lessonTitle}</h2>
      <p>{lesson.description}</p>
      <div className="lesson-content">
        {lesson.lessonText && <p>{lesson.lessonText}</p>}
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
  );
};

export default CourseLessonViewer;
