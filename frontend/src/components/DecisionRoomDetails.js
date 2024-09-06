import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaPlus, FaVoteYea, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DecisionRoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}`);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load decision room details');
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{room.decisionRoomName}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Proposals</h2>
        {room.proposals.length > 0 ? (
          <ul>
            {room.proposals.map((proposal) => (
              <li key={proposal._id} className="bg-white p-4 shadow rounded-lg mb-4">
                <Link to={`/decision-rooms/${id}/proposal/${proposal._id}`} className="text-lg font-bold">
                  {proposal.proposalTitle}
                </Link>
                <div className="flex space-x-4 mt-2">
                  <Link to={`/decision-rooms/${id}/proposal/${proposal._id}/vote`} className="text-blue-500">
                    <FaVoteYea className="inline mr-2" />
                    Vote
                  </Link>
                  <Link to={`/decision-rooms/${id}/proposal/${proposal._id}/discussion`} className="text-green-500">
                    <FaComments className="inline mr-2" />
                    Discussion
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No proposals yet. Be the first to propose a decision.</p>
        )}
      </div>
      <Link to={`/decision-rooms/${id}/add-proposal`} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
        <FaPlus className="mr-2" /> Add Proposal
      </Link>
    </div>
  );
};

export default DecisionRoomDetails;
