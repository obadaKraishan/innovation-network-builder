import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const VotingSection = ({ proposal, votingType }) => {
  const { id, proposalId } = useParams(); // Get room and proposal IDs from URL params
  const [voteValue, setVoteValue] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmitVote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/decisions/cast-vote', {
        roomId: id,
        proposalId,
        voteValue,
        comment,
      });
      toast.success('Vote submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit vote');
      console.error('Error submitting vote:', error);
    }
  };

  const renderVotingOptions = () => {
    switch (votingType) {
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

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Vote on Proposal</h2>
      <form onSubmit={handleSubmitVote}>
        <div className="mb-4">
          {renderVotingOptions()}
        </div>
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
  );
};

export default VotingSection;
