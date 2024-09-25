import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaCertificate } from 'react-icons/fa';

const CourseFinalQuiz = () => {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFinalQuiz = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/final-quiz`);
        setQuiz(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load final quiz');
        setLoading(false);
      }
    };
    fetchFinalQuiz();
  }, [courseId]);

  const handleChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/courses/${courseId}/final-quiz/submit`, { answers });
      toast.success('Final quiz submitted successfully');
      navigate(`/courses/${courseId}/certificate`);
    } catch (error) {
      toast.error('Failed to submit final quiz');
    }
  };

  if (loading) return <div>Loading quiz...</div>;

  return (
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
            Submit Final Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseFinalQuiz;
