import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaPlus, FaCog, FaSearch, FaEdit, FaTrashAlt, FaClipboardList, FaCalendarAlt, FaClock, FaUser, FaBuilding, FaUserTie, FaHourglassHalf, FaChalkboardTeacher, FaInfoCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import Modal from 'react-modal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const statusOptions = [
  { value: 'requested', label: 'Requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
];

const orderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const MeetingBooking = () => {
  const [bookings, setBookings] = useState({ bookedWithOthers: [], bookedByOthers: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(orderOptions[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showMoreWithOthers, setShowMoreWithOthers] = useState(false);
  const [showMoreByOthers, setShowMoreByOthers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        const departmentOptions = data.map(department => ({
          value: department._id,
          label: department.name,
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to fetch departments.');
      }
    };

    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const userId = user?._id;

        if (!userId) {
          throw new Error('User ID not found.');
        }

        const { data } = await api.get('/booking', { params: { userId } });
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings.');
      }
    };

    fetchDepartments();
    fetchBookings();
  }, []);

  const handleSearch = (items) => {
    return items.filter((item) => {
      const matchesSearchTerm = searchTerm
        ? item?.user?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          item?.date?.includes(searchTerm) ||
          item?.time?.includes(searchTerm) ||
          item?.agenda?.toLowerCase()?.includes(searchTerm.toLowerCase())
        : true;

      const matchesStatus = selectedStatus ? item?.status === selectedStatus.value : true;

      const matchesDepartment = selectedDepartment
        ? item?.user?.department?.name === selectedDepartment.label
        : true;

      const matchesDateRange =
        (startDate && endDate)
          ? moment(item.date).isBetween(moment(startDate).startOf('day'), moment(endDate).endOf('day'))
          : true;

      return matchesSearchTerm && matchesStatus && matchesDepartment && matchesDateRange;
    });
  };

  const handleOrderChange = (items) => {
    return items.sort((a, b) => {
      return selectedOrder.value === 'asc'
        ? moment(a.date).diff(moment(b.date))
        : moment(b.date).diff(moment(a.date));
    });
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/booking/status/${bookingId}`, { status: newStatus });
      setBookings((prevBookings) => ({
        ...prevBookings,
        bookedWithOthers: prevBookings.bookedWithOthers.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ),
        bookedByOthers: prevBookings.bookedByOthers.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ),
      }));
      toast.success('Meeting status updated successfully.');
    } catch (error) {
      console.error('Error updating meeting status:', error);
      toast.error('Failed to update meeting status.');
    }
  };

  const handleCancelMeeting = async (bookingId) => {
    await handleStatusChange(bookingId, 'canceled');
  };

  const openModal = (booking) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBooking(null);
  };

  let filteredBookedWithOthers = handleSearch(bookings.bookedWithOthers);
  let filteredBookedByOthers = handleSearch(bookings.bookedByOthers);

  filteredBookedWithOthers = handleOrderChange(filteredBookedWithOthers);
  filteredBookedByOthers = handleOrderChange(filteredBookedByOthers);

  // Slice to show only top 5 and conditionally expand
  const visibleBookedWithOthers = showMoreWithOthers
    ? filteredBookedWithOthers
    : filteredBookedWithOthers.slice(0, 5);
  const visibleBookedByOthers = showMoreByOthers
    ? filteredBookedByOthers
    : filteredBookedByOthers.slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <ToastContainer />

        <h2 className="text-3xl font-semibold mb-6">My Meetings</h2>
        <div className="flex justify-between mb-6">
          <button
            onClick={() => navigate('/book-meeting')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600 transition"
          >
            <FaPlus className="mr-2" /> Create New Meeting
          </button>
          <button
            onClick={() => navigate('/meeting-availability')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-600 transition"
          >
            <FaCog className="mr-2" /> Update Availability
          </button>
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center w-1/3">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center w-1/3">
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Filter by status"
              className="w-full"
            />
          </div>
          <div className="flex items-center w-1/3">
            <Select
              options={departments}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Filter by department"
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center w-1/3">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center w-1/3">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="End Date"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center w-1/3">
            <Select
              options={orderOptions}
              value={selectedOrder}
              onChange={setSelectedOrder}
              placeholder="Sort by"
              className="w-full"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Meetings I Have Booked with Others</h3>
        {visibleBookedWithOthers.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleBookedWithOthers.map((booking) => (
              <li key={booking._id} className="p-6 bg-white rounded-lg shadow-lg relative flex flex-col">
                <div className="flex items-center text-lg font-semibold text-blue-700">
                  <FaClipboardList className="mr-2" />
                  <span>{booking.agenda}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{moment(booking.date).format('MMMM Do YYYY')}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaClock className="mr-2" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaUser className="mr-2" />
                  <span>{booking.user.name}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaBuilding className="mr-2" />
                  <span>{booking.user?.department?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaUserTie className="mr-2" />
                  <span>{booking.user.position}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaHourglassHalf className="mr-2" />
                  <span>{booking.duration}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaChalkboardTeacher className="mr-2" />
                  <span>{booking.type}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaInfoCircle className="mr-2" />
                  <span>{booking.status}</span>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleCancelMeeting(booking._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meetings booked with others.</p>
        )}
        {filteredBookedWithOthers.length > 5 && !showMoreWithOthers && (
          <button
            onClick={() => setShowMoreWithOthers(true)}
            className="text-blue-500 hover:underline mt-4"
          >
            See More
          </button>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-4">Meetings Others Have Booked with Me</h3>
        {visibleBookedByOthers.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleBookedByOthers.map((booking) => (
              <li key={booking._id} className="p-6 bg-white rounded-lg shadow-lg relative flex flex-col">
                <div className="flex items-center text-lg font-semibold text-blue-700">
                  <FaClipboardList className="mr-2" />
                  <span>{booking.agenda}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{moment(booking.date).format('MMMM Do YYYY')}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaClock className="mr-2" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaUser className="mr-2" />
                  <span>{booking.bookedBy.name}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaBuilding className="mr-2" />
                  <span>{booking.bookedBy?.department?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaUserTie className="mr-2" />
                  <span>{booking.bookedBy.position}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaHourglassHalf className="mr-2" />
                  <span>{booking.duration}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaChalkboardTeacher className="mr-2" />
                  <span>{booking.type}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaInfoCircle className="mr-2" />
                  <span>{booking.status}</span>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleCancelMeeting(booking._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meetings booked by others.</p>
        )}
        {filteredBookedByOthers.length > 5 && !showMoreByOthers && (
          <button
            onClick={() => setShowMoreByOthers(true)}
            className="text-blue-500 hover:underline mt-4"
          >
            See More
          </button>
        )}

        {/* Edit Meeting Modal */}
        {currentBooking && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Edit Meeting"
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto my-20"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Meeting</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Agenda:</label>
                <input
                  type="text"
                  value={currentBooking.agenda}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, agenda: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find(option => option.value === currentBooking.status)}
                  onChange={(option) => setCurrentBooking({ ...currentBooking, status: option.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleStatusChange(currentBooking._id, currentBooking.status)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 ml-4 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MeetingBooking;
