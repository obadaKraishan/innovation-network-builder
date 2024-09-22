import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaSpinner,
  FaExclamationCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate"; // For pagination

const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0); // For pagination
  const ticketsPerPage = 10; // Number of tickets per page
  const pagesVisited = pageNumber * ticketsPerPage;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get("/support/my-tickets");
        setTickets(data);
        setFilteredTickets(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch ticket history");
        toast.error("Failed to fetch ticket history");
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Live filter tickets based on status, priority, and date
  useEffect(() => {
    let filtered = tickets;

    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter(
        (ticket) => ticket.priority === priorityFilter
      );
    }
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.createdAt);
        return (
          ticketDate >= new Date(dateRange.start) &&
          ticketDate <= new Date(dateRange.end)
        );
      });
    }

    setFilteredTickets(filtered);
  }, [statusFilter, priorityFilter, dateRange, tickets]);

  // Pagination logic
  const pageCount = Math.ceil(filteredTickets.length / ticketsPerPage);
  const displayTickets = filteredTickets.slice(
    pagesVisited,
    pagesVisited + ticketsPerPage
  );

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Ticket History */}
        <h2 className="text-2xl font-bold mb-4">Ticket History</h2>

        {/* Filter Options */}
        <div className="filters mb-4 p-4 bg-white shadow-md rounded-lg flex space-x-4 items-center">
          <FaFilter className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Date Range Filter */}
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-2xl text-blue-500" />
            <span className="ml-2">Loading tickets...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <FaExclamationCircle className="inline-block mr-2" />
            {error}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No tickets available.
          </div>
        ) : (
          <div>
            {displayTickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="bg-white shadow-md rounded-lg p-6 mb-4"
              >
                <p>
                  <strong>Ticket ID:</strong> {ticket.ticketId}
                </p>
                <p>
                  <strong>Description:</strong> {ticket.description}
                </p>

                {/* Badge container */}
                <div className="flex space-x-4">
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`badge ${
                        ticket.status === "New"
                          ? "bg-blue-500"
                          : ticket.status === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } text-white px-3 py-1 rounded`}
                    >
                      {ticket.status}
                    </span>
                  </p>
                  <p>
                    <strong>Priority:</strong>
                    <span
                      className={`badge ${
                        ticket.priority === "Low"
                          ? "bg-green-500"
                          : ticket.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      } text-white px-3 py-1 rounded`}
                    >
                      {ticket.priority}
                    </span>
                  </p>
                </div>

                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}

            {/* Pagination */}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBtns"} // Apply the pagination container class
              previousLinkClassName={"previousBtn"} // Apply the previous button class
              nextLinkClassName={"nextBtn"} // Apply the next button class
              disabledClassName={"paginationDisabled"} // Apply the disabled button class
              activeClassName={"paginationActive"} // Apply the active page class
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketHistory;
