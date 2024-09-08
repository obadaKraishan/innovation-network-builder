import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import api from '../utils/api';
import { toast } from 'react-toastify';

const SubmitFeedback = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { data } = await api.get('/wellness/all-surveys');
        setSurveys(data);
      } catch (error) {
        toast.error('Failed to fetch surveys');
      }
    };
    fetchSurveys();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wellness/submit-feedback', { surveyId: selectedSurvey, feedback, isAnonymous });
      toast.success('Feedback submitted successfully');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Add Sidebar */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Submit Wellness Feedback</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Select Survey</label>
              <select
                    value={selectedSurvey || ""}  // Use an empty string instead of null
                    onChange={(e) => setSelectedSurvey(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded"
                    >
                    <option value="">Select a survey...</option>
                    {surveys.map((survey) => (
                        <option key={survey._id} value={survey._id}>
                        {survey.title}
                        </option>
                    ))}
                </select>
            </div>
            {selectedSurvey && (
              <>
                {surveys
                  .find((survey) => survey._id === selectedSurvey)
                  .questions.map((question, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-gray-700">{question}</label>
                      <input
                        type="text"
                        value={feedback[index] || ''}
                        onChange={(e) => {
                          const newFeedback = [...feedback];
                          newFeedback[index] = e.target.value;
                          setFeedback(newFeedback);
                        }}
                        className="w-full p-3 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  ))}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mr-2"
                    />
                    Submit Anonymously
                  </label>
                </div>
                <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg">
                  Submit Feedback
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;
