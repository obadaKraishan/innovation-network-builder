import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseQuizSection = () => {
  const { courseId, quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/quiz/${quizId}`);
        setQuiz(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load quiz');
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [courseId, quizId]);

  const handleChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${courseId}/quiz/submit`, { quizId, answers });
      toast.success('Quiz submitted successfully');
      navigate(`/courses/${courseId}/progress`);
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <button onClick={() => window.history.back()} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
          ← Back
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{quiz.quizTitle}</h2>

          <form onSubmit={handleSubmit}>
            {quiz.questions.map((question, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{question.questionText}</h3>

                {question.choices.map((choice, i) => (
                  <div key={i} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={choice}
                        onChange={() => handleChange(question._id, choice)}
                        className="mr-2"
                      />
                      {choice}
                    </label>
                  </div>
                ))}
              </div>
            ))}
 
            <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg">
              Submit Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseQuizSection;
