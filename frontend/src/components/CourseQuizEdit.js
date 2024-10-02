import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import api from '../utils/api';
import Sidebar from './Sidebar';
import { FaPlusCircle, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';

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

  const handleChoicesChange = (index, choiceIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index].choices[choiceIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { type: 'text', questionText: '', choices: [], correctAnswer: '' }],
    });
  };

  const addChoice = (index) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index].choices.push('');
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].choices = updatedQuestions[questionIndex].choices.filter((_, i) => i !== choiceIndex);
    setQuiz({ ...quiz, questions: updatedQuestions });
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

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <h2 className="font-bold text-xl mb-4">Edit Quiz</h2>

        {/* Quiz Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Quiz Title</label>
          <input
            type="text"
            name="quizTitle"
            value={quiz.quizTitle}
            onChange={handleQuizChange}
            className="w-full p-2 border mb-4"
            placeholder="Quiz Title"
          />
        </div>

        {/* Quiz Questions */}
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-100">
            <label className="block text-gray-700 font-medium mb-2">Question {index + 1}</label>
            {/* Question Text */}
            <label className="block text-gray-700">Question Text</label>
            <input
              type="text"
              name="questionText"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
              className="w-full p-2 border mb-2"
              placeholder="Question Text"
            />

            {/* Question Type */}
            <label className="block text-gray-700">Question Type</label>
            <Select
              options={questionTypes}
              value={questionTypes.find((opt) => opt.value === question.type)}
              onChange={(selected) => handleQuestionChange(index, 'type', selected.value)}
              className="mb-2"
            />

            {/* Choices for Multiple Choice Questions */}
            {['radio', 'checkbox', 'select'].includes(question.type) && (
              <div>
                <label className="block text-gray-700">Choices</label>
                {question.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={choice}
                      onChange={(e) => handleChoicesChange(index, choiceIndex, e.target.value)}
                      placeholder={`Choice ${choiceIndex + 1}`}
                      className="w-full p-2 border mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeChoice(index, choiceIndex)}
                      className="text-red-500"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addChoice(index)}
                  className="text-blue-500 hover:underline mt-2 flex items-center"
                >
                  <FaPlusCircle className="mr-2" /> Add Choice
                </button>
              </div>
            )}

            {/* Correct Answer */}
            <label className="block text-gray-700">Correct Answer</label>
            <input
              type="text"
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              placeholder="Correct Answer"
              className="w-full p-2 border mb-2"
            />

            {/* Remove Question Button */}
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="text-red-500 mt-2 flex items-center"
            >
              <FaTrashAlt className="mr-2" /> Remove Question
            </button>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="text-blue-500 hover:underline mt-2 flex items-center"
        >
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
