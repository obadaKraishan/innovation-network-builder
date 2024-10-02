import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import api from '../utils/api';
import Sidebar from './Sidebar';
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'radio', label: 'Multiple Choice (Radio)' },
  { value: 'checkbox', label: 'Multiple Choice (Checkbox)' },
  { value: 'select', label: 'Dropdown' },
];

const CourseQuizEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/courses/quizzes/${id}`);
        setQuiz(data);
      } catch (error) {
        toast.error('Error fetching quiz');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { type: 'text', questionText: '', choices: [], correctAnswer: '' }],
    });
  };

  const removeQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/courses/quizzes/${id}`, quiz);
      toast.success('Quiz updated successfully');
      navigate('/quizzes');
    } catch (error) {
      toast.error('Error updating quiz');
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="font-bold text-xl mb-4">Edit Quiz</h2>

        {/* Quiz Title */}
        <input
          type="text"
          name="quizTitle"
          value={quiz.quizTitle}
          onChange={handleQuizChange}
          className="w-full p-2 border mb-4"
          placeholder="Quiz Title"
        />

        {/* Quiz Questions */}
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-100">
            {/* Question Text */}
            <input
              type="text"
              name="questionText"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
              className="w-full p-2 border mb-2"
              placeholder="Question Text"
            />

            {/* Question Type */}
            <Select
              options={questionTypes}
              value={questionTypes.find((opt) => opt.value === question.type)}
              onChange={(selected) => handleQuestionChange(index, 'type', selected.value)}
              className="mb-2"
            />

            {/* Choices for Multiple Choice Questions */}
            {['radio', 'checkbox', 'select'].includes(question.type) && (
              <textarea
                value={question.choices.join(', ')}
                onChange={(e) => handleQuestionChange(index, 'choices', e.target.value.split(',').map((choice) => choice.trim()))}
                placeholder="Comma-separated choices (e.g., Choice1, Choice2, Choice3)"
                className="w-full p-2 border mb-2"
              />
            )}

            {/* Correct Answer */}
            <input
              type="text"
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              placeholder="Correct Answer"
              className="w-full p-2 border mb-2"
            />

            {/* Remove Question Button */}
            <button type="button" onClick={() => removeQuestion(index)} className="text-red-500 mt-2 flex items-center">
              <FaTrashAlt className="mr-2" /> Remove Question
            </button>
          </div>
        ))}

        {/* Add Question Button */}
        <button type="button" onClick={addQuestion} className="text-blue-500 hover:underline mt-2 flex items-center">
          <FaPlusCircle className="mr-2" /> Add Question
        </button>

        {/* Timed and Randomized Options */}
        <div className="flex items-center mt-4">
          <label className="flex items-center mr-4">
            <input
              type="checkbox"
              name="isTimed"
              checked={quiz.isTimed}
              onChange={(e) => setQuiz({ ...quiz, isTimed: e.target.checked })}
              className="mr-2"
            />
            Timed Quiz
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="randomizeQuestions"
              checked={quiz.randomizeQuestions}
              onChange={(e) => setQuiz({ ...quiz, randomizeQuestions: e.target.checked })}
              className="mr-2"
            />
            Randomize Questions
          </label>
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CourseQuizEdit;
