import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from './Sidebar';

const WellnessFeedbackDetails = () => {
  const { feedbackId } = useParams(); // Get the feedbackId from the URL
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
        try {
          const { data } = await api.get(`/wellness/feedback/${feedbackId}`);
          setFeedbackDetails(data);
        } catch (error) {
          console.error('Failed to fetch feedback details:', error);
        }
      };      

    fetchFeedbackDetails();
  }, [feedbackId]);

  if (!feedbackDetails) {
    return <div>Loading...</div>;
  }

  const { feedback, surveyQuestions, employeeId, anonymous } = feedbackDetails;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Feedback Details</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Feedback from: {anonymous ? 'Anonymous' : employeeId.name}</h2>
            <p>Submitted on: {new Date(feedbackDetails.createdAt).toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Survey Questions and Responses</h2>
            <ul className="space-y-2">
              {surveyQuestions.map((question, index) => (
                <li key={index} className="p-2 bg-white shadow rounded">
                  <strong>Q: {question.label}</strong>
                  <p>A: {feedback.find(fb => fb.questionId === question._id)?.response || 'No response'}</p>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate(-1)} // Go back to previous page
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WellnessFeedbackDetails;
