import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaCheck, FaTimes, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const GroupsInvitations = () => {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        console.log('Fetching received invitations from API...');
        const { data: received } = await api.get('/groups/invitations/received');
        console.log('Received Invitations from API:', received);
        setReceivedInvitations(received);

        console.log('Fetching sent invitations from API...');
        const { data: sent } = await api.get('/groups/invitations/sent');
        console.log('Sent Invitations from API:', sent);
        setSentInvitations(sent);
      } catch (error) {
        console.error('Error fetching invitations:', error);
        toast.error('Failed to load invitations.');
      }
    };

    fetchInvitations();
  }, []);

  // Handle accepting the invitation
  const handleAcceptInvitation = async (invitationId) => {
    try {
      console.log(`Accepting invitation: ${invitationId}`);
      await api.put(`/groups/invitation/${invitationId}`, { status: 'accepted' });
      setReceivedInvitations(receivedInvitations.filter(inv => inv._id !== invitationId));
      toast.success('Invitation accepted successfully!');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation.');
    }
  };

  // Handle declining the invitation with SweetAlert confirmation
  const handleDeclineInvitation = async (invitationId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to decline this invitation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, decline it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`Declining invitation: ${invitationId}`);
          await api.put(`/groups/invitation/${invitationId}`, { status: 'declined' });
          setReceivedInvitations(receivedInvitations.filter(inv => inv._id !== invitationId));
          toast.success('Invitation declined successfully!');
        } catch (error) {
          console.error('Error declining invitation:', error);
          toast.error('Failed to decline invitation.');
        }
      }
    });
  };

  // Handle cancelling sent invitation
  const handleCancelInvitation = async (invitationId) => {
    try {
      console.log(`Cancelling invitation: ${invitationId}`);
      await api.delete(`/groups/invitation/${invitationId}`);
      setSentInvitations(sentInvitations.filter(inv => inv._id !== invitationId));
      toast.success('Invitation cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h2 className="text-3xl font-semibold mb-6">Group Invitations</h2>

        <h3 className="text-xl font-semibold mb-4">Received Invitations</h3>
        {receivedInvitations.length > 0 ? (
          <ul className="space-y-4 mb-6">
            {receivedInvitations.map((invitation) => (
              <li
                key={invitation._id}
                className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700">Group: {invitation.group?.name || 'Unknown Group'}</p>
                  <p className="text-sm text-gray-500">From: {invitation.from?.name || 'Unknown User'}</p>
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
        ) : (
          <p className="text-gray-500">No received invitations to display.</p>
        )}

        {/* Divider */}
        <hr className="my-8 border-t-2 border-gray-300" />

        <h3 className="text-xl font-semibold mb-4">Sent Invitations</h3>
        {sentInvitations.length > 0 ? (
          <ul className="space-y-4">
            {sentInvitations.map((invitation) => (
              <li
                key={invitation._id}
                className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700">Group: {invitation.group?.name || 'Unknown Group'}</p>
                  <p className="text-sm text-gray-500">To: {invitation.user?.name || 'Unknown User'}</p>
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
        ) : (
          <p className="text-gray-500">No sent invitations to display.</p>
        )}
      </div>
    </div>
  );
};

export default GroupsInvitations;
