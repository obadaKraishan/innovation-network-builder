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

        <h2 className="font-bold text-2xl mb-6 text-gray-700">Quiz Details</h2>

        {/* Quiz Title */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Title:</label>
          <p className="text-lg text-gray-900">{quiz.quizTitle}</p>
        </div>

        {/* Related Course */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Course:</label>
          <p className="text-lg text-gray-900">{quiz.courseId?.title || 'N/A'}</p>
        </div>

        {/* Quiz Settings */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Quiz Settings:</label>
          <ul className="list-disc pl-6">
            <li><strong>Timed:</strong> {quiz.isTimed ? 'Yes' : 'No'}</li>
            <li><strong>Randomize Questions:</strong> {quiz.randomizeQuestions ? 'Yes' : 'No'}</li>
          </ul>
        </div>

        {/* Quiz Questions */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Questions:</label>
          {quiz.questions.length > 0 ? (
            <ul className="list-disc pl-6">
              {quiz.questions.map((question, index) => (
                <li key={index} className="mb-4">
                  <p className="text-lg text-gray-900 font-semibold">Question {index + 1}:</p>
                  <p><strong>Type:</strong> {question.type}</p>
                  <p><strong>Text:</strong> {question.questionText}</p>
                  {['radio', 'checkbox', 'select'].includes(question.type) && (
                    <div>
                      <p><strong>Choices:</strong></p>
                      <ul className="list-disc pl-6">
                        {question.choices.map((choice, choiceIndex) => (
                          <li key={choiceIndex}>{choice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p><strong>Correct Answer:</strong> {question.correctAnswer || 'N/A'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions available for this quiz.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseQuizDetails;
