import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CreateSurvey = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const addQuestion = () => setQuestions([...questions, '']);
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wellness/create-survey', { title, questions, isAnonymous });
      toast.success('Survey created successfully');
    } catch (error) {
      toast.error('Failed to create survey');
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create Wellness Survey</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Survey Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Survey Questions</label>
          {questions.map((question, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={question}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index] = e.target.value;
                  setQuestions(updatedQuestions);
                }}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(index)} className="ml-2 text-red-500">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="mt-2 text-blue-500">
            Add Question
          </button>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            Allow Anonymous Feedback
          </label>
        </div>
        <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg">
          Create Survey
        </button>
      </form>
    </div>
  );
};

export default CreateSurvey;
