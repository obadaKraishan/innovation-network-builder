import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Sidebar from './Sidebar';
import { FaArrowLeft } from 'react-icons/fa';

const CourseQuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/courses/quizzes/${id}`);
        setQuiz(data);
      } catch (error) {
        toast.error('Error fetching quiz details');
      }
    };

    fetchQuiz();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <h2 className="font-bold text-3xl mb-6 text-gray-700">Quiz Details</h2>

        {/* Quiz Title Section */}
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-2">Title</h3>
          <p className="text-lg text-gray-900">{quiz.quizTitle}</p>
        </div>

        {/* Related Course Section */}
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-2">Course</h3>
          <p className="text-lg text-gray-900">{quiz.courseId?.title || 'N/A'}</p>
        </div>

        {/* Quiz Settings Section */}
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-2">Quiz Settings</h3>
          <ul className="list-inside list-disc text-gray-900">
            <li><strong>Timed:</strong> {quiz.isTimed ? 'Yes' : 'No'}</li>
            <li><strong>Randomize Questions:</strong> {quiz.randomizeQuestions ? 'Yes' : 'No'}</li>
          </ul>
        </div>

        {/* Quiz Questions Section */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-4">Questions</h3>
          {quiz.questions.length > 0 ? (
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-inner">
                  <p className="text-lg font-semibold text-gray-900 mb-2">Question {index + 1}</p>
                  <p><strong>Type:</strong> {question.type}</p>
                  <p><strong>Text:</strong> {question.questionText}</p>

                  {['radio', 'checkbox', 'select'].includes(question.type) && (
                    <div className="mt-2">
                      <p className="font-bold">Choices:</p>
                      <ul className="list-inside list-disc pl-6">
                        {question.choices.map((choice, choiceIndex) => (
                          <li key={choiceIndex} className="text-gray-700">{choice}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-2"><strong>Correct Answer:</strong> {question.correctAnswer || 'N/A'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No questions available for this quiz.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseQuizDetails;
