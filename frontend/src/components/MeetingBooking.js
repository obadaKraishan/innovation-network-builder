import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MeetingBooking = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('30 minutes');
  const [meetingType, setMeetingType] = useState('Zoom');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agenda, setAgenda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentsAndUsers = async () => {
      try {
        const { data } = await api.get('/booking/departments');
        setDepartments(data.departments);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching departments and users:', error);
        toast.error('Failed to fetch departments and users.');
      }
    };

    fetchDepartmentsAndUsers();
  }, []);

  const handleBooking = async () => {
    try {
      const bookingData = {
        userId: selectedUser.value,
        selectedUser: selectedUser.value,
        date: selectedDate,
        time: selectedTime,
        duration,
        type: meetingType,
        phoneNumber,
        agenda,
      };

      await api.post('/booking', bookingData);
      toast.success('Meeting booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking meeting:', error);
      toast.error('Failed to book meeting.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <ToastContainer />
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Step 1: Select Department and User</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
              <Select
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                options={departments.map(dept => ({ value: dept._id, label: dept.name }))}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">User:</label>
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={users
                  .filter(user => user.department === selectedDepartment?.value)
                  .map(user => ({ value: user._id, label: user.name }))}
                className="w-full"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedDepartment || !selectedUser}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
            >
              <FaArrowRight className="mr-2" /> Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Step 2: Select Date and Time</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                excludeDates={[new Date().setDate(new Date().getDate() - 1)]}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Time:</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {/* Add available times from 9:00 AM to 5:00 PM */}
                <option value="" disabled>Select Time</option>
                {[...Array(8).keys()].map(i => (
                  <option key={i} value={`${9 + i}:00 AM`}>{`${9 + i}:00 AM`}</option>
                ))}
                {[...Array(8).keys()].map(i => (
                  <option key={i + 8} value={`${1 + i}:00 PM`}>{`${1 + i}:00 PM`}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Duration:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              >
                <FaArrowRight className="mr-2" /> Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Step 3: Confirm Booking</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Meeting Type:</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="Zoom">Zoom</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
            {meetingType === 'Phone' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Agenda:</label>
              <textarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                onClick={handleBooking}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingBooking;
