import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import { FaArrowLeft } from 'react-icons/fa';

const VotingSection = () => {
  const { id, proposalId } = useParams();
  const [voteValue, setVoteValue] = useState('');
  const [comment, setComment] = useState('');
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}/proposal/${proposalId}`);
        setProposal(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load proposal details');
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id, proposalId]);

  const handleSubmitVote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/decisions/cast-vote`, {
        roomId: id,
        proposalId,
        voteValue,
        comment,
      });
      toast.success('Vote submitted successfully');
      navigate(-1); // Navigate back after voting
    } catch (error) {
      toast.error('Failed to submit vote');
    }
  };

  const renderVotingOptions = () => {
    switch (proposal?.votingType) {
      case 'approval':
        return (
          <>
            <label>
              <input
                type="radio"
                value="approve"
                checked={voteValue === 'approve'}
                onChange={(e) => setVoteValue(e.target.value)}
              />
              Approve
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="reject"
                checked={voteValue === 'reject'}
                onChange={(e) => setVoteValue(e.target.value)}
              />
              Reject
            </label>
          </>
        );
      case 'ranking':
        return (
          <select
            value={voteValue}
            onChange={(e) => setVoteValue(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Ranking</option>
            {[1, 2, 3, 4, 5].map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
        );
      case 'rating':
        return (
          <select
            value={voteValue}
            onChange={(e) => setVoteValue(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Rate (1-5)</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-xl font-bold mb-4">Vote on Proposal</h2>
        <form onSubmit={handleSubmitVote}>
          <div className="mb-4">{renderVotingOptions()}</div>
          <div className="mb-4">
            <label className="block text-gray-700">Optional Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit Vote
          </button>
        </form>
      </div>
    </div>
  );
};

export default VotingSection;
