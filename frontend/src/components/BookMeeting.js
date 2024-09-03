import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BookMeeting = () => {
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
  const [events, setEvents] = useState([]);
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

  useEffect(() => {
    const fetchUserAvailability = async () => {
      try {
        const userId = selectedUser?.value;
        if (userId) {
          const { data } = await api.get(`/booking/availability?userId=${userId}`);
          const unavailableDates = data.map((date) => ({
            title: 'Unavailable',
            start: new Date(date.start),
            end: new Date(date.end),
            allDay: true,
          }));
          setEvents(unavailableDates);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Failed to fetch user availability.');
      }
    };

    if (selectedUser) {
      fetchUserAvailability();
    }
  }, [selectedUser]);

  const handleBooking = async () => {
    try {
      const bookingData = {
        userId: localStorage.getItem('userId'),
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

  const handleDateSelect = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedTime(moment(slotInfo.start).format('h:mm A'));
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
                  .filter(user => user.department.startsWith(selectedDepartment?.value))
                  .map(user => ({ value: user._id, label: user.name }))}
                className="w-full"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => navigate('/meeting-booking')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedDepartment || !selectedUser}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              >
                <FaArrowRight className="mr-2" /> Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Step 2: Select Date and Time</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400 }}
              selectable
              onSelectSlot={handleDateSelect}
            />
            <div className="flex justify-between mt-4">
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

export default BookMeeting;
