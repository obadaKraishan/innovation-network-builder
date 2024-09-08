import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../utils/api';
import { toast } from 'react-toastify';

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'radio', label: 'Multiple Choice (Radio)' },
  { value: 'checkbox', label: 'Multiple Choice (Checkbox)' },
  { value: 'select', label: 'Dropdown' },
  { value: 'date', label: 'Date Picker' },
];

const EditWellnessSurvey = () => {
    const { surveyId } = useParams();
    console.log(surveyId);  // Check if this prints a valid survey ID    
  const { register, control, handleSubmit, reset } = useForm();
  const [questions, setQuestions] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const { data } = await api.get(`/wellness/surveys/${surveyId}`);
        reset({ title: data.title });
        setQuestions(data.surveyQuestions);
        setIsAnonymous(data.isAnonymous);
      } catch (error) {
        toast.error('Failed to load survey data');
      }
    };

    fetchSurvey();
  }, [surveyId, reset]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmitSurvey = async (data) => {
    try {
      await api.put(`/wellness/surveys/${surveyId}`, { title: data.title, questions, isAnonymous });
      toast.success('Survey updated successfully');
      navigate('/wellness-dashboard');
    } catch (error) {
      toast.error('Failed to update survey');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
          Back
        </button>
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Edit Wellness Survey</h1>
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
                        value={question.options.join(', ')}
                        onChange={(e) => handleQuestionChange(index, 'options', e.target.value.split(','))}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
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
              Update Survey
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWellnessSurvey;
