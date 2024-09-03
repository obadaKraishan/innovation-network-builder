import React, { useState } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MeetingAvailability = () => {
  const [datesToDisable, setDatesToDisable] = useState([]);
  
  const handleDateChange = (date) => {
    setDatesToDisable([...datesToDisable, date]);
  };

  const handleUpdateAvailability = async () => {
    try {
      const userId = localStorage.getItem('userId'); 
      await api.put('/booking/availability', { userId, datesToDisable });
      toast.success('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <ToastContainer />

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Update Your Availability</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Dates to Disable:</label>
            <DatePicker
              selected={null}
              onChange={handleDateChange}
              minDate={new Date()}
              className="w-full p-3 border border-gray-300 rounded-lg"
              inline
              highlightDates={datesToDisable}
            />
          </div>
          <button onClick={handleUpdateAvailability} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition">
            Update Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingAvailability;
