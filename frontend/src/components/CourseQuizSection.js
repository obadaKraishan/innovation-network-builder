import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CourseQuizSection = () => {
  const { courseId, quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/${quizId}`); // Updated to fetch the quiz directly
        setQuiz(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load quiz');
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${courseId}/quiz/submit`, { quizId, answers });
      toast.success('Quiz submitted successfully');
      setSubmitted(true); // Set quiz as submitted
      navigate(`/courses/${courseId}/progress`);
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (submitted) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold">Quiz Submitted</h2>
        <p>Your quiz has been successfully submitted!</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
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
