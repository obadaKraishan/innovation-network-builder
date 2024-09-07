import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import { FaArrowLeft } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import AuthContext

const VotingSection = () => {
  const { id, proposalId } = useParams();
  const [voteValue, setVoteValue] = useState('');
  const [comment, setComment] = useState('');
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0); // Real-time vote count
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}/proposal/${proposalId}`);
        setProposal(data);
        setLoading(false);
        setVoteCount(data.votes.length); // Set the initial vote count
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
      setVoteCount(voteCount + 1); // Update vote count in real-time
      navigate(-1); // Navigate back after voting
    } catch (error) {
      toast.error('Failed to submit vote');
    }
  };

  const renderVotingOptions = () => {
    if (!proposal || proposal.createdBy._id === user._id) {
      return <p>You cannot vote on your own proposal.</p>; // Display message if user is the creator
    }

    switch (proposal?.votingType) {
      case 'approval':
        return (
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="radio"
                value="approve"
                checked={voteValue === 'approve'}
                onChange={(e) => setVoteValue(e.target.value)}
                className="form-radio text-blue-600"
                id="approve"
              />
              <label htmlFor="approve" className="ml-2 text-gray-700">
                Approve
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="radio"
                value="reject"
                checked={voteValue === 'reject'}
                onChange={(e) => setVoteValue(e.target.value)}
                className="form-radio text-red-600"
                id="reject"
              />
              <label htmlFor="reject" className="ml-2 text-gray-700">
                Reject
              </label>
            </div>
          </div>
        );
      case 'ranking':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Rank the proposal (1-5):</label>
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
          </div>
        );
      case 'rating':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Rate the proposal (1-5):</label>
            <select
              value={voteValue}
              onChange={(e) => setVoteValue(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return <p>No voting type available for this proposal.</p>;
    }
  };

  const renderVotesList = () => {
    if (proposal?.votes?.length > 0) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Votes List:</h3>
          <ul className="mt-4">
            {proposal.votes.map((vote, index) => (
              <li key={vote._id} className="bg-white p-4 rounded-lg shadow mb-4">
                <p><strong>Voted By:</strong> {vote.votedBy.name || 'Anonymous'}</p>
                <p><strong>Vote:</strong> {vote.voteValue}</p>
                <p><strong>Comment:</strong> {vote.comment || 'No comment'}</p>
                <p><strong>Voted At:</strong> {new Date(vote.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return <p>No votes have been submitted yet.</p>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-xl font-bold mb-4">Vote on Proposal</h2>

        {/* Display voting options dynamically */}
        <form onSubmit={handleSubmitVote}>
          {renderVotingOptions()}

          {/* Comment box for feedback */}
          <div className="mb-4">
            <label className="block text-gray-700">Optional Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Provide feedback if needed..."
            />
          </div>

          {/* Submit button */}
          {!proposal || proposal.createdBy._id !== user._id ? (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Submit Vote
            </button>
          ) : null}

        </form>

        {/* Real-time vote count */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Current Vote Count: {voteCount}</h3>
        </div>

        {/* Render Votes List */}
        {renderVotesList()}
      </div>
    </div>
  );
};

export default VotingSection;
