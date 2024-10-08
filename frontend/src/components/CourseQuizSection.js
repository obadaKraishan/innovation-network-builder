import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CourseQuizSection = ({ courseId, quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [quizNotFound, setQuizNotFound] = useState(false); // New state to track quiz availability
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log('Fetching quiz with quizId:', quizId); // Log the quizId being used

        // Check if quizId is provided; if not, assume no quiz
        if (!quizId) {
          console.log('No quizId provided');
          setQuizNotFound(true);
          setLoading(false);
          return;
        }

        // Fetch the quiz for the specific lesson
        const response = await api.get(`/quizzes/${quizId}`);
        console.log('Quiz response from server:', response.data); // Log the response from backend

        if (response.data && response.data.questions.length > 0) {
          console.log('Quiz found:', response.data);
          setQuiz(response.data); // Set quiz if valid data exists
        } else {
          console.log('No questions found in quiz');
          setQuizNotFound(true); // Mark quiz as not found if no questions
        }
        setLoading(false);
      } catch (error) {
        console.log('Error fetching quiz:', error); // Log any error that occurs
        toast.error('Failed to load quiz');
        setQuizNotFound(true);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    console.log('Updated answers:', answers); // Log the updated answers for each question
  };

  const handleCheckboxChange = (questionId, value) => {
    const updatedAnswers = { ...answers };
    if (updatedAnswers[questionId]) {
      if (updatedAnswers[questionId].includes(value)) {
        updatedAnswers[questionId] = updatedAnswers[questionId].filter(val => val !== value);
      } else {
        updatedAnswers[questionId].push(value);
      }
    } else {
      updatedAnswers[questionId] = [value];
    }
    setAnswers(updatedAnswers);
    console.log('Updated answers for checkbox:', updatedAnswers); // Log the updated answers for checkboxes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting quiz with answers:', answers); // Log the answers being submitted
      await api.post(`/courses/${courseId}/quiz/submit`, { quizId, answers });
      toast.success('Quiz submitted successfully');
      setSubmitted(true); // Mark quiz as submitted
      navigate(`/courses/${courseId}/progress`); // Navigate to progress
    } catch (error) {
      console.log('Error submitting quiz:', error); // Log any error during submission
      toast.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (quizNotFound) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold">No Quiz Available</h2>
        <p>This lesson does not have a quiz.</p>
      </div>
    );
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

                {question.type === 'text' && (
                  <input
                    type="text"
                    className="w-full p-2 border"
                    value={answers[question._id] || ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                    placeholder="Your answer"
                  />
                )}

                {question.type === 'radio' && question.choices.map((choice, i) => (
                  <div key={i} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={choice}
                        onChange={() => handleChange(question._id, choice)}
                        checked={answers[question._id] === choice}
                        className="mr-2"
                      />
                      {choice}
                    </label>
                  </div>
                ))}

                {question.type === 'checkbox' && question.choices.map((choice, i) => (
                  <div key={i} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name={`question-${index}`}
                        value={choice}
                        onChange={() => handleCheckboxChange(question._id, choice)}
                        checked={answers[question._id]?.includes(choice)}
                        className="mr-2"
                      />
                      {choice}
                    </label>
                  </div>
                ))}

                {question.type === 'date' && (
                  <input
                    type="date"
                    className="w-full p-2 border"
                    value={answers[question._id] || ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  />
                )}
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
