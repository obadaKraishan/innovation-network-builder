import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaReply, FaReplyAll, FaForward, FaArrowLeft } from 'react-icons/fa';

const MessageDetails = () => {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      const { data } = await api.get(`/messages/${id}`);
      setMessage(data);
    };

    fetchMessage();
  }, [id]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        {message && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{message.subject}</h1>
            <p className="text-sm text-gray-500">From: {message.sender.name} | {new Date(message.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-500">To: {message.recipients.map(r => r.name).join(', ')}</p>
            <p className="text-sm text-gray-500">CC: {message.cc.map(c => c.name).join(', ')}</p>
            <div className="mt-4">
              <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: message.body }} />
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Attachments:</h3>
                  <ul>
                    {message.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a href={attachment.path} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {attachment.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex space-x-4 mt-6">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition">
                <FaReply className="mr-2" /> Reply
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition">
                <FaReplyAll className="mr-2" /> Reply All
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-600 transition">
                <FaForward className="mr-2" /> Forward
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDetails;
