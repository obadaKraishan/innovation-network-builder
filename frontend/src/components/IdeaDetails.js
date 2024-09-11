import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaArrowLeft, FaCheckCircle, FaEdit, FaTimesCircle, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Assuming there's an AuthContext for managing roles

const IdeaDetails = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Get the current user and their role
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStage, setNewStage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();

  // Fetch idea details
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

  // Handle updating the idea's stage
  const handleStageUpdate = async () => {
    try {
      await api.post(`/innovation/update-idea-stage/${id}`, { stage: newStage });
      toast.success('Stage updated successfully');
      navigate('/innovation-dashboard');
    } catch (error) {
      toast.error('Failed to update stage');
    }
  };

  // Handle idea withdrawal (for idea owners in submission or review stage)
  const handleWithdrawIdea = async () => {
    try {
      await api.post(`/innovation/withdraw-idea/${id}`);
      toast.success('Idea withdrawn successfully');
      navigate('/innovation-dashboard');
    } catch (error) {
      toast.error('Failed to withdraw idea');
    }
  };

  // Download attachments
  const handleDownloadAttachment = (attachmentUrl) => {
    window.open(attachmentUrl, '_blank');
  };

  if (loading) return <div>Loading...</div>;

  // Determine if the user is the idea owner
  const isIdeaOwner = user._id === idea.employeeId._id;

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

          {/* Show attachments if any */}
          {attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Attachments</h3>
              <ul>
                {attachments.map((file, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleDownloadAttachment(file.url)}
                      className="text-blue-500 hover:underline"
                    >
                      <FaDownload className="inline-block mr-1" /> {file.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Buttons based on user role and ownership */}
          {user.role === 'Employee' && !isIdeaOwner && (
            <div className="text-red-500 mt-6">
              You do not have permission to edit or approve this idea.
            </div>
          )}

          {/* Idea owner-specific options (can edit, withdraw) */}
          {isIdeaOwner && (idea.stage === 'submission' || idea.stage === 'review') && (
            <div className="mt-6">
              <button
                onClick={() => navigate(`/edit-idea/${id}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-600 transition"
              >
                <FaEdit className="mr-2" /> Edit Idea
              </button>
              <button
                onClick={handleWithdrawIdea}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition mt-4"
              >
                <FaTimesCircle className="mr-2" /> Withdraw Idea
              </button>
            </div>
          )}

          {/* Manager or higher role functionalities */}
          {['Team Leader', 'Department Manager', 'Product Manager', 'Research Scientist'].includes(user.role) &&
            idea.stage === 'review' && (
              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">Update Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4"
                >
                  <option value="">Select new stage</option>
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
          )}

          {/* Executive functionalities */}
          {['CEO', 'CTO', 'Executive'].includes(user.role) && idea.stage === 'review' && (
            <div className="mt-6">
              <button
                onClick={handleStageUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              >
                <FaCheckCircle className="mr-2" /> Approve for Development
              </button>
            </div>
          )}

          {/* Legal Advisor */}
          {user.role === 'Legal Advisor' && (
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Legal Review</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              >
                <option value="">Select compliance status</option>
                <option value="approved">Approved for Compliance</option>
                <option value="needs-review">Needs Further Review</option>
              </select>
              <button
                onClick={handleStageUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
              >
                <FaCheckCircle className="mr-2" /> Submit Compliance Status
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
