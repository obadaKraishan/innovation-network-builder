import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const GroupsInvitations = () => {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const { data: received } = await api.get('/groups/invitations/received');
        setReceivedInvitations(received);
        const { data: sent } = await api.get('/groups/invitations/sent');
        setSentInvitations(sent);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
    };

    fetchInvitations();
  }, []);

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await api.put(`/groups/invitation/${invitationId}`, { status: 'accepted' });
      setReceivedInvitations(receivedInvitations.filter(inv => inv._id !== invitationId));
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      await api.put(`/groups/invitation/${invitationId}`, { status: 'declined' });
      setReceivedInvitations(receivedInvitations.filter(inv => inv._id !== invitationId));
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    try {
      await api.delete(`/groups/invitation/${invitationId}`);
      setSentInvitations(sentInvitations.filter(inv => inv._id !== invitationId));
    } catch (error) {
      console.error('Error cancelling invitation:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-6">Group Invitations</h2>

        <h3 className="text-xl font-semibold mb-4">Received Invitations</h3>
        <ul className="space-y-4 mb-6">
          {receivedInvitations.map(invitation => (
            <li
              key={invitation._id}
              className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700">Group: {invitation.group.name}</p>
                <p className="text-sm text-gray-500">From: {invitation.group.createdBy.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptInvitation(invitation._id)}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => handleDeclineInvitation(invitation._id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <FaTimes />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mb-4">Sent Invitations</h3>
        <ul className="space-y-4">
          {sentInvitations.map(invitation => (
            <li
              key={invitation._id}
              className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700">Group: {invitation.group.name}</p>
                <p className="text-sm text-gray-500">To: {invitation.user.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCancelInvitation(invitation._id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupsInvitations;
