import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';  // Import Sidebar
import api from '../utils/api';
import { FaPlus, FaVoteYea, FaComments, FaArrowLeft } from 'react-icons/fa';  // Import back icon
import { toast } from 'react-toastify';

const DecisionRoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize navigate hook

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
    <div className="flex h-screen">
      <Sidebar />  {/* Add Sidebar here */}
      <div className="flex-1 p-6 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
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
    </div>
  );
};

export default DecisionRoomDetails;
