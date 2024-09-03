import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const MeetingAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [disabledTimes, setDisabledTimes] = useState([]);
  const [duration, setDuration] = useState('30 minutes');  // Initialize duration with a default value
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const userId = user?._id;
        
        if (!userId || !selectedDate) {
          // Handle the case where userId or selectedDate is missing
          toast.error('User ID and Date are required.');
          return;
        }
        
        const formattedDate = selectedDate.toISOString().split('T')[0];  // Format date as YYYY-MM-DD
        const { data } = await api.get(`/booking/availability?userId=${userId}&date=${formattedDate}&duration=${duration === '30 minutes' ? 30 : 60}`);
        
        setExistingBookings(data.bookedTimes || []);
        setDisabledTimes(data.timeRanges || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Failed to fetch availability.');
      }
    };
    
    fetchAvailability();
  }, [selectedDate, duration]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setAvailableTimes(generateAvailableTimes(date));
    setSelectedTimes([]);
  };

  const generateAvailableTimes = (date) => {
    const times = [];
    let currentTime = moment(date).hour(9).minute(0); // Start at 9 AM
    const endTime = moment(date).hour(17).minute(0);  // End at 5 PM

    while (currentTime.isBefore(endTime)) {
      const isBookedOrDisabled = existingBookings.some(booking => {
        const bookingTime = moment(`${booking.date} ${booking.time}`, 'YYYY-MM-DD h:mm A');
        return currentTime.isSame(bookingTime, 'minute');
      }) || disabledTimes.some(disabled => {
        return currentTime.isBetween(moment(disabled.start), moment(disabled.end), null, '[)');
      });

      if (!isBookedOrDisabled) {
        times.push(currentTime.clone());
      }
      currentTime.add(30, 'minutes');
    }

    return times;
  };

  const handleTimeSelection = (time) => {
    setSelectedTimes(prevTimes =>
      prevTimes.includes(time)
        ? prevTimes.filter(t => t !== time)
        : [...prevTimes, time]
    );
  };

  const handleRemoveDisabledTime = (time) => {
    setDisabledTimes(disabledTimes.filter(disabled => !moment(disabled.start).isSame(time, 'minute')));
  };

  const handleUpdateAvailability = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const userId = user?._id;

      const disableRange = {
        datesToDisable: selectedDate ? [selectedDate] : [],
        timeRanges: [...disabledTimes, ...selectedTimes.map(time => ({
          start: time.toDate(),
          end: time.clone().add(30, 'minutes').toDate()
        }))]
      };

      await api.put('/booking/availability', { userId, disableRange });
      toast.success('Availability updated successfully!');
      setDisabledTimes(disableRange.timeRanges);  // Update the state to reflect the changes
      setSelectedDate(null);
      setSelectedTimes([]);
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              className="w-full p-3 border border-gray-300 rounded-lg"
              inline
              filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0} // Disable weekends
            />
          </div>

          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Select Time Slots to Disable:</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.length > 0 ? (
                  availableTimes.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelection(time)}
                      className={`w-full p-3 border ${
                        selectedTimes.includes(time) ? 'bg-blue-500 text-white' : 'bg-white text-black'
                      } rounded-lg`}
                    >
                      {time.format('h:mm A')}
                    </button>
                  ))
                ) : (
                  <p>No available times for this date.</p>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Currently Disabled Time Slots:</h3>
            {disabledTimes.length > 0 ? (
              disabledTimes.map((time, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-200 p-2 rounded-lg mb-2">
                  <span>{moment(time.start).format('MMMM Do YYYY, h:mm A')} - {moment(time.end).format('h:mm A')}</span>
                  <button
                    onClick={() => handleRemoveDisabledTime(moment(time.start))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Enable
                  </button>
                </div>
              ))
            ) : (
              <p>No time slots disabled.</p>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleUpdateAvailability}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              disabled={!selectedDate || selectedTimes.length === 0}
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
