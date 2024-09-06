import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const ProposalDetails = () => {
  const { id, proposalId } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}/proposal/${proposalId}`);
        setProposal(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load proposal details');
        setLoading(false);
      }
    };

    fetchProposalDetails();
  }, [id, proposalId]);

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
        <h1 className="text-2xl font-bold mb-6">{proposal.proposalTitle}</h1>
        <p className="mb-6">{proposal.proposalDescription}</p>

        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Votes</h2>
          {proposal.votes.length > 0 ? (
            proposal.votes.map((vote) => (
              <div key={vote._id} className="border-b pb-4 mb-4">
                <p>
                  <strong>{vote.votedBy.name}:</strong> {vote.voteValue} {vote.comment && ` - ${vote.comment}`}
                </p>
              </div>
            ))
          ) : (
            <p>No votes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
