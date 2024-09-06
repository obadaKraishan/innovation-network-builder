import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaPlus, FaVoteYea, FaComments, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import AuthContext from '../context/AuthContext';  // Import your auth context to get the current user

const DecisionRoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const { user } = useContext(AuthContext);  // Get the current logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}`);
        setRoom(data);
        setLoading(false);
        console.log('Room created by:', data.createdBy._id);
        console.log('Logged in user:', user._id);
      } catch (error) {
        toast.error('Failed to load decision room details');
      }
    };

    fetchRoomDetails();
  }, [id, user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProposalTitle('');
    setProposalDescription('');
  };

  const handleAddProposal = async () => {
    try {
      await api.post('/decisions/add-proposal', {
        roomId: id,
        proposalTitle,
        proposalDescription,
      });
      toast.success('Proposal added successfully');
      closeModal();
    } catch (error) {
      toast.error('Failed to add proposal');
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

        {/* Add Proposal Button */}
        <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
          <FaPlus className="mr-2" /> Add Proposal
        </button>

        {/* Edit Decision Room Button (only for room creator) */}
        {room.createdBy._id === user._id && (  // Compare room's creator with logged-in user
          <button
            onClick={() => navigate(`/edit-decision-room/${id}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center mt-4"
          >
            <FaEdit className="mr-2" /> Edit Room
          </button>
        )}

        {/* Modal for Adding Proposal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Proposal Modal"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',  // Adjust width
              padding: '20px',
            },
          }}
        >
          <h2 className="text-xl font-bold mb-4">Add Proposal</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddProposal();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Proposal Title</label>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Proposal Description</label>
              <textarea
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Add Proposal
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default DecisionRoomDetails;
