import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaArrowRight, FaArrowLeft, FaCopy, FaShareAlt, FaCalendarAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment'; 
import { saveAs } from 'file-saver';

const BookMeeting = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingType, setMeetingType] = useState('Zoom');
  const [duration, setDuration] = useState('30 minutes');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agenda, setAgenda] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentsAndUsers = async () => {
      try {
        const { data } = await api.get('/booking/departments');
        setDepartments(data.departments);
        setUsers(data.users);
      } catch (error) {
        toast.error('Failed to fetch departments and users.');
      }
    };
    fetchDepartmentsAndUsers();
  }, []);

  const filterUsersByDepartment = (deptId) => {
    const departmentIds = [deptId];
    const subDeptIds = departments.find(dept => dept._id === deptId)?.subDepartments.map(subDept => subDept._id) || [];
    return users.filter(user => departmentIds.includes(String(user.department._id)) || subDeptIds.includes(String(user.department._id)));
  };

  useEffect(() => {
    const fetchUserAvailability = async () => {
      try {
        if (selectedUser && selectedDate) {
          const userId = selectedUser.value;
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const { data } = await api.get(`/booking/availability?userId=${userId}&date=${formattedDate}&duration=${duration === '30 minutes' ? 30 : 60}`);
  
          console.log("Available Times from API:", data.availableTimes);
          
          setAvailableTimes(data.availableTimes);
        }
      } catch (error) {
        toast.error('Failed to fetch user availability.');
      }
    };
  
    if (selectedDate && selectedUser) {
      fetchUserAvailability();
    }
  }, [selectedDate, selectedUser, duration]);  

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const userId = user?._id;
  
      if (!userId) {
        throw new Error("User ID is missing.");
      }

      const bookingData = {
        userId,
        selectedUser: selectedUser.value,
        date: selectedDate,
        time: selectedTime,
        duration,
        type: meetingType,
        phoneNumber,
        agenda,
      };
  
      const response = await api.post('/booking', bookingData);
      toast.success('Meeting booked successfully!');
      setBookingDetails(response.data);  // Set booking details to display confirmation
      setStep(5);  // Move to the confirmation step
    } catch (error) {
      toast.error(error.message || 'Failed to book meeting.');
    }
  };  

  const copyToClipboard = () => {
    const text = `Meeting with ${selectedUser.label} on ${selectedDate.toLocaleDateString()} at ${selectedTime}. Duration: ${duration}. Type: ${meetingType}. Agenda: ${agenda}`;
    navigator.clipboard.writeText(text);
    toast.success('Meeting details copied to clipboard!');
  };

  const shareMeeting = () => {
    const shareText = `Meeting with ${selectedUser.label} on ${selectedDate.toLocaleDateString()} at ${selectedTime}. Duration: ${duration}. Type: ${meetingType}. Agenda: ${agenda}`;
    if (navigator.share) {
      navigator.share({
        title: 'Meeting Details',
        text: shareText,
      }).then(() => {
        toast.success('Meeting details shared successfully!');
      }).catch((error) => {
        toast.error('Error sharing meeting details.');
      });
    } else {
      copyToClipboard(); // Fallback to copy if the Web Share API is not available
    }
  };

  const exportToCalendar = () => {
    const icsData = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${agenda}
DTSTART:${moment(bookingDetails.date).format('YYYYMMDD')}T${moment(bookingDetails.time, 'h:mm A').format('HHmm00')}Z
DTEND:${moment(bookingDetails.date).format('YYYYMMDD')}T${moment(bookingDetails.time, 'h:mm A').add(bookingDetails.duration === '30 minutes' ? 30 : 60, 'minutes').format('HHmm00')}Z
DESCRIPTION:Meeting with ${bookingDetails.user.name}
LOCATION:${meetingType === 'Zoom' ? 'Zoom' : 'Phone: ' + bookingDetails.phoneNumber}
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsData], { type: 'text/calendar' });
    saveAs(blob, 'meeting.ics');
    toast.success('Meeting exported to calendar!');
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
                onChange={(option) => {
                  const user = users.find(u => u._id === option.value);
                  setSelectedUser({ value: user._id, label: user.name, ...user });
                }}
                options={selectedDepartment ? filterUsersByDepartment(selectedDepartment.value).map(user => ({ value: user._id, label: user.name })) : []}
                className="w-full"
              />
            </div>
            {selectedUser && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">User Details:</h3>
                <p>Name: {selectedUser.label}</p>
                <p>Email: {selectedUser.email}</p>
                <p>Role: {selectedUser.role}</p>
                <p>Position: {selectedUser.position}</p>
                <p>Department: {selectedUser.department.name}</p>
              </div>
            )}
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
            <h2 className="text-2xl font-semibold mb-6">Step 2: Select Date and Duration</h2>
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
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
              className="w-full p-3 border border-gray-300 rounded-lg"
              inline
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
                disabled={!selectedDate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              >
                <FaArrowRight className="mr-2" /> Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Step 3: Select Time</h2>
            <div className="mb-4">
              {availableTimes.length > 0 ? (
                availableTimes.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(time)}
                    className={`w-full mb-2 p-3 border ${
                      selectedTime === time ? 'bg-blue-500 text-white' : 'bg-white text-black'
                    } rounded-lg`}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <p>No available times for this date. Please select another date.</p>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedTime}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              >
                <FaArrowRight className="mr-2" /> Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Step 4: Confirm Booking</h2>
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
                onClick={() => setStep(3)}
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

        {step === 5 && bookingDetails && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Meeting Confirmation</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p><strong>With:</strong> {bookingDetails.user.name}</p>
              <p><strong>Date:</strong> {moment(bookingDetails.date).format('MMMM Do YYYY')}</p>
              <p><strong>Time:</strong> {bookingDetails.time}</p>
              <p><strong>Duration:</strong> {bookingDetails.duration}</p>
              <p><strong>Type:</strong> {bookingDetails.type}</p>
              <p><strong>Agenda:</strong> {bookingDetails.agenda}</p>
              <p><strong>Phone Number:</strong> {bookingDetails.phoneNumber || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button onClick={copyToClipboard} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition">
                <FaCopy className="mr-2" /> Copy Details
              </button>
              <button onClick={shareMeeting} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition">
                <FaShareAlt className="mr-2" /> Share
              </button>
              <button onClick={exportToCalendar} className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-600 transition">
                <FaCalendarAlt className="mr-2" /> Export to Calendar
              </button>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
              >
                Book Another Meeting
              </button>
              <button
                onClick={() => navigate('/meeting-booking')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              >
                Go to Meeting Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookMeeting;
