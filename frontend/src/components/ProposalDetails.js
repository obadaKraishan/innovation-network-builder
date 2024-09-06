import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ProposalDetails = () => {
  const { id, proposalId } = useParams();
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}/proposal/${proposalId}`);
        setProposal(data);
      } catch (error) {
        toast.error('Failed to load proposal details');
      }
    };

    fetchProposalDetails();
  }, [id, proposalId]);

  if (!proposal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{proposal.proposalTitle}</h1>
      <p className="mb-6">{proposal.proposalDescription}</p>

      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Votes</h2>
        {proposal.votes.map((vote) => (
          <div key={vote._id} className="border-b pb-4 mb-4">
            <p>
              <strong>{vote.votedBy.name}:</strong> {vote.voteValue} {vote.comment && ` - ${vote.comment}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalDetails;
