import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaReply, FaReplyAll, FaForward, FaArrowLeft, FaStar, FaTimes } from 'react-icons/fa';
import SunEditorComponent from './SunEditorComponent';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MessageDetails = () => {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [replyMode, setReplyMode] = useState(null); // null, 'reply', 'replyAll', 'forward'
  const [replyBody, setReplyBody] = useState('');
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [cc, setCc] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      const { data } = await api.get(`/messages/${id}`);
      setMessage(data);
    };

    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/message-recipients');
        const formattedUsers = data.map(user => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users.');
      }
    };

    fetchMessage();
    fetchUsers();
  }, [id]);

  const handleReply = (mode) => {
    setReplyMode(mode);
    setReplyBody(`<p></p><blockquote>${message.body}</blockquote>`); // Include original message
    setSubject(`Re: ${message.subject}`);
    if (mode === 'replyAll') {
      setCc(message.cc.map(c => ({ value: c._id, label: c.name })));
    }
  };

  const handleForward = () => {
    setReplyMode('forward');
    setReplyBody(`<p></p><blockquote>${message.body}</blockquote>`);
    setSubject(`Fwd: ${message.subject}`);
  };

  const handleSend = async () => {
    const messageData = {
      recipients: recipients.map((recipient) => recipient.value),
      cc: cc.map((c) => c.value),
      subject,
      body: replyBody,
    };

    try {
      await api.post('/messages', messageData);
      toast.success('Message sent successfully!');
      setReplyMode(null); // Reset mode after sending
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message.');
    }
  };

  const toggleImportant = async () => {
    try {
      await api.put(`/messages/${id}/important`);
      setMessage((prev) => ({ ...prev, isImportant: !prev.isImportant }));
      toast.success('Message importance updated!');
    } catch (error) {
      console.error('Error toggling importance:', error);
      toast.error('Failed to update message importance.');
    }
  };

  const handleDiscard = () => {
    setReplyMode(null);
    setReplyBody('');
    setSubject('');
    setRecipients([]);
    setCc([]);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <ToastContainer />
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-md"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        {message && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{message.subject}</h1>
                <p className="text-sm text-gray-500">
                  From: {message.sender.name} | {new Date(message.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">To: {message.recipients.map(r => r.name).join(', ')}</p>
                {message.cc.length > 0 && (
                  <p className="text-sm text-gray-500">CC: {message.cc.map(c => c.name).join(', ')}</p>
                )}
              </div>
              <button
                onClick={toggleImportant}
                className={`text-yellow-500 ${message.isImportant ? 'text-yellow-600' : ''}`}
              >
                <FaStar className="text-2xl" />
              </button>
            </div>
            <div className="mt-4 mb-6">
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
            {!replyMode && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleReply('reply')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
                >
                  <FaReply className="mr-2" /> Reply
                </button>
                <button
                  onClick={() => handleReply('replyAll')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
                >
                  <FaReplyAll className="mr-2" /> Reply All
                </button>
                <button
                  onClick={handleForward}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-600 transition"
                >
                  <FaForward className="mr-2" /> Forward
                </button>
              </div>
            )}
            {replyMode && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">
                  {replyMode === 'reply' && 'Replying to Message'}
                  {replyMode === 'replyAll' && 'Replying to All'}
                  {replyMode === 'forward' && 'Forwarding Message'}
                </h2>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  {replyMode === 'forward' && (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">To:</label>
                        <Select
                          isMulti
                          value={recipients}
                          onChange={setRecipients}
                          options={users}
                          className="w-full"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">CC:</label>
                        <Select
                          isMulti
                          value={cc}
                          onChange={setCc}
                          options={users}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
                    <SunEditorComponent
                      value={replyBody}
                      onChange={setReplyBody}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSend}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
                    >
                      Send
                    </button>
                    <button
                      onClick={handleDiscard}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
                    >
                      <FaTimes className="mr-2" /> Discard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDetails;
