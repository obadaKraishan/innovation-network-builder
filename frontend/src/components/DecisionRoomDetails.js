import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaPlus, FaVoteYea, FaComments, FaArrowLeft, FaEdit, FaArchive } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import AuthContext from '../context/AuthContext';

const DecisionRoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch room details only if the user is available
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        if (!user) {
          throw new Error('User not available');
        }
        const { data } = await api.get(`/decisions/${id}`);
        if (!data || !data._id) {
          throw new Error('Room data is invalid or empty');
        }
        console.log('Fetched room details:', data); // Debug: check the room data
        setRoom(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load decision room details');
        setLoading(false);
      }
    };

    if (user) {
      fetchRoomDetails();
    }
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
      window.location.reload(); // Refresh the page to show the new proposal
    } catch (error) {
      toast.error('Failed to add proposal');
    }
  };

  const handleArchiveRoom = async () => {
    try {
      await api.post(`/decisions/archive/${id}`);
      toast.success('Decision room has been archived.');
      setRoom({ ...room, status: 'archived' });
    } catch (error) {
      toast.error('Failed to archive the decision room.');
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
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold mb-6">{room.decisionRoomName}</h1>

        {/* Display room details */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-bold mb-2">Details</h2>
          <p><strong>Created By:</strong> {room.createdBy?.name || 'Unknown'}</p>
          <p><strong>Members:</strong> {room.members.map((member) => member.name).join(', ')}</p>
          <p><strong>Voting Type:</strong> {room.votingType.charAt(0).toUpperCase() + room.votingType.slice(1)}</p>
          <p><strong>Privacy:</strong> {room.isPrivate ? 'Private' : 'Public'}</p>
          <p><strong>Created At:</strong> {new Date(room.createdAt).toLocaleString()}</p>
        </div>

        {/* Proposals Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Proposals</h2>
          {room.proposals.length > 0 ? (
            <ul>
              {room.proposals.map((proposal) => (
                <li key={proposal._id} className="bg-white p-4 shadow rounded-lg mb-4">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/decision-rooms/${id}/proposal/${proposal._id}`} className="text-lg font-bold">
                        {proposal.proposalTitle}
                      </Link>
                      <p><strong>Created By:</strong> {proposal.createdBy?.name || 'Unknown'}</p>
                      <p><strong>Description:</strong> {proposal.proposalDescription}</p>
                      <p><strong>Created At:</strong> {new Date(proposal.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <Link to={`/decision-rooms/${id}/proposal/${proposal._id}/vote`} className="text-blue-500">
                        <FaVoteYea className="inline mr-2" /> {proposal.votes.length} Votes
                      </Link>
                      <Link to={`/decision-rooms/${id}/proposal/${proposal._id}/discussion`} className="text-green-500">
                        <FaComments className="inline mr-2" /> {proposal.discussion.length} Comments
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No proposals yet. Be the first to propose a decision.</p>
          )}
        </div>

        {/* Add Proposal and Archive Room Button */}
        {room.status !== 'archived' && (
          <div className="flex space-x-4">
            <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
              <FaPlus className="mr-2" /> Add Proposal
            </button>

            {/* Archive Room Button (only for room creator) */}
            {room.createdBy && room.createdBy._id === user?._id && (
              <button
                onClick={handleArchiveRoom}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaArchive className="mr-2" /> Archive Room
              </button>
            )}
          </div>
        )}

        {room.status === 'archived' && (
          <p className="text-red-500 text-lg font-bold mt-4">
            This decision room has been archived. No further proposals, votes, or discussions are allowed.
          </p>
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
              width: '500px',
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
