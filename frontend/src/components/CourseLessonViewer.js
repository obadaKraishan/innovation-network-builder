import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';

const CourseLessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/lesson/${lessonId}`);
        setLesson(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load lesson');
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) {
    return <div>Loading lesson...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <button onClick={() => window.history.back()} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
          ← Back
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{lesson.lessonTitle}</h2>

          {lesson.lessonType === 'video' ? (
            <ReactPlayer url={lesson.videoUrl} controls className="mb-4" />
          ) : (
            <p className="text-gray-700 mb-4">{lesson.textContent}</p>
          )}

          <div>
            {lesson.additionalMaterials && lesson.additionalMaterials.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Additional Materials</h3>
                <ul className="list-disc ml-6">
                  {lesson.additionalMaterials.map((material, index) => (
                    <li key={index}>
                      <a href={material.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        {material.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessonViewer;
