import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import api from '../utils/api';

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'radio', label: 'Multiple Choice (Radio)' },
  { value: 'checkbox', label: 'Multiple Choice (Checkbox)' },
  { value: 'select', label: 'Dropdown' },
  { value: 'date', label: 'Date Picker' },
];

const CreateSurvey = () => {
  const { register, control, handleSubmit } = useForm();
  const [questions, setQuestions] = useState([{ type: 'text', label: '', options: [] }]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'text', label: '', options: [] }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmitSurvey = async (data) => {
    try {
      await api.post('/wellness/create-survey', { title: data.title, questions, isAnonymous });
      toast.success('Survey created successfully');
    } catch (error) {
      toast.error('Failed to create survey');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Create Wellness Survey</h1>
          <form onSubmit={handleSubmit(handleSubmitSurvey)}>
            <div className="mb-4">
              <label className="block text-gray-700">Survey Title</label>
              <input
                type="text"
                {...register('title', { required: true })}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold">Survey Questions</h2>
              {questions.map((question, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg">
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={question.label}
                      onChange={(e) => handleQuestionChange(index, 'label', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Question Title"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="ml-2 text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-2">
                    <label>Question Type</label>
                    <Select
                      options={questionTypes}
                      onChange={(selected) => handleQuestionChange(index, 'type', selected.value)}
                      defaultValue={questionTypes.find((type) => type.value === question.type)}
                    />
                  </div>

                  {['radio', 'checkbox', 'select'].includes(question.type) && (
                    <div className="mb-4">
                      <label>Options (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Option1, Option2, Option3"
                        onChange={(e) => handleQuestionChange(index, 'options', e.target.value.split(','))}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  )}

                  {question.type === 'date' && (
                    <div className="mb-4">
                      <label>Select Default Date</label>
                      <Controller
                        control={control}
                        name={`questions[${index}].defaultDate`}
                        render={({ field }) => (
                          <DatePicker
                            className="w-full p-2 border border-gray-300 rounded"
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}

              <button type="button" onClick={addQuestion} className="text-blue-500">
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
      </div>
    </div>
  );
};

export default CreateSurvey;
