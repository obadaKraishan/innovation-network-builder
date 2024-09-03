import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const MeetingAvailability = () => {
  const [datesToDisable, setDatesToDisable] = useState([]);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [timeRanges, setTimeRanges] = useState([]);
  const [disableTimeRange, setDisableTimeRange] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const userId = user?._id;
        const { data } = await api.get(`/booking/availability?userId=${userId}`);
        setDatesToDisable(data.datesToDisable || []);
        setTimeRanges(data.timeRanges || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Failed to fetch availability.');
      }
    };
    fetchAvailability();
  }, []);

  const handleDateChange = (date) => {
    setDatesToDisable([...datesToDisable, date]);
  };

  const handleRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeStart(start);
    setRangeEnd(end);
  };

  const handleAddTimeRange = () => {
    if (rangeStart && rangeEnd) {
      setTimeRanges([...timeRanges, { start: rangeStart, end: rangeEnd }]);
      setRangeStart(null);
      setRangeEnd(null);
    } else {
      toast.error('Please select a valid time range.');
    }
  };

  const handleUpdateAvailability = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const userId = user?._id;
      const disableRange = {
        datesToDisable,
        timeRanges,
      };
      await api.put('/booking/availability', { userId, disableRange });
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
        <button
          onClick={() => navigate('/meeting-booking')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center hover:bg-gray-600 transition"
        >
          Back
        </button>

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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Time Range to Disable:</label>
            <DatePicker
              selected={rangeStart}
              onChange={handleRangeChange}
              startDate={rangeStart}
              endDate={rangeEnd}
              selectsRange
              inline
            />
            <button
              onClick={handleAddTimeRange}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center hover:bg-blue-600 transition"
            >
              Add Time Range
            </button>
          </div>
          <div>
            {timeRanges.map((range, index) => (
              <p key={index}>
                {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
              </p>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleUpdateAvailability}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
            >
              Update Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingAvailability;
