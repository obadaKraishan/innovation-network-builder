import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaArrowLeft, FaCheckCircle, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const IdeaDetails = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStage, setNewStage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {
        const { data } = await api.get(`/innovation/idea/${id}`);
        setIdea(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load idea details');
        setLoading(false);
      }
    };
    fetchIdeaDetails();
  }, [id]);

  const handleStageUpdate = async () => {
    try {
      await api.post(`/innovation/update-idea-stage/${id}`, { stage: newStage });
      toast.success('Stage updated successfully');
      navigate('/innovation-dashboard');
    } catch (error) {
      toast.error('Failed to update stage');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-500 text-white py-2 px-4 rounded-lg inline-flex items-center hover:bg-gray-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">{idea.title}</h2>
          <p><strong>Description:</strong> {idea.description}</p>
          <p><strong>Problem:</strong> {idea.problem}</p>
          <p><strong>Suggested Solution:</strong> {idea.solution}</p>
          <p><strong>Expected Impact:</strong> {idea.expectedImpact}</p>
          <p><strong>Stage:</strong> {idea.stage}</p>
          <p><strong>Department:</strong> {idea.department?.name || 'N/A'}</p>
          <p><strong>Submitted By:</strong> {idea.employeeId?.name}</p>
          <p><strong>Scores:</strong></p>
          <ul className="list-disc pl-6">
            <li>Impact: {idea.impactScore}</li>
            <li>Feasibility: {idea.feasibilityScore}</li>
            <li>Cost: {idea.costScore}</li>
            <li>Alignment: {idea.alignmentScore}</li>
          </ul>

          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">Update Stage</label>
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="">Select new stage</option>
              <option value="review">Review</option>
              <option value="development">Development</option>
              <option value="implementation">Implementation</option>
            </select>

            <button
              onClick={handleStageUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
            >
              <FaCheckCircle className="mr-2" /> Update Stage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
