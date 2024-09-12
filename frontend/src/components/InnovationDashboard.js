import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaPlus,
    FaMapSigns,
    FaMedal,
    FaCalendarAlt,
    FaUserFriends,
    FaFileAlt,
    FaInfoCircle,
    FaTag,
    FaBuilding,
    FaChartLine,
    FaMoneyBillWave,
} from "react-icons/fa";
import api from "../utils/api";
import Select from "react-select";

const InnovationDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { data } = await api.get("/innovation/ideas");
        setIdeas(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch ideas");
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas
    .filter(
      (idea) =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((idea) => !stageFilter || idea.stage === stageFilter);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Innovation Dashboard</h1>
          <button
            onClick={() => navigate("/submit-idea")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Submit Idea
          </button>
        </div>

        {/* Add buttons to navigate to Roadmap and Leaderboard */}
        <div className="flex space-x-4 mb-6">
          {/* Innovation Roadmap Button */}
          <button
            onClick={() => navigate("/innovation-roadmap")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaMapSigns className="mr-2" /> Innovation Roadmap
          </button>

          {/* Innovation Leaderboard Button */}
          <button
            onClick={() => navigate("/innovation-leaderboard")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaMedal className="mr-2" /> Innovation Leaderboard
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex items-center">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Stage Filter */}
        <div className="mb-6">
          <Select
            placeholder="Filter by Stage"
            options={[
              { value: "submission", label: "Submission" },
              { value: "review", label: "Review" },
              { value: "development", label: "Development" },
              { value: "implementation", label: "Implementation" },
            ]}
            onChange={(option) => setStageFilter(option ? option.value : "")}
            isClearable
            className="w-full"
          />
        </div>

        {/* Loading, Error, and Empty States */}
        {loading ? (
          <div className="text-center text-gray-500">Loading ideas...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center text-gray-500">No ideas available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIdeas.map((idea) => (
              <div
                key={idea._id}
                className="bg-white shadow-lg rounded-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4">{idea.title}</h2>
                
                <p className="text-gray-600 mb-2">
                  <FaFileAlt className="inline-block mr-1" />
                  <strong>Description:</strong> {idea.description || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <FaInfoCircle className="inline-block mr-1" />
                  <strong>Stage:</strong> {idea.stage || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <FaUserFriends className="inline-block mr-1" />
                  <strong>Submitted By:</strong> {idea.employeeId?.name || "Unknown"}
                </p>
                <p className="text-gray-600 mb-2">
                  <FaCalendarAlt className="inline-block mr-1" />
                  <strong>Submitted At:</strong> {idea.submittedAt ? new Date(idea.submittedAt).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <FaBuilding className="inline-block mr-1" />
                  <strong>Departments:</strong> {idea.department && idea.department.length
                    ? idea.department.map((dept) => dept.name).join(", ")
                    : "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <FaChartLine className="inline-block mr-1" />
                  <strong>ROI Estimate:</strong> {idea.roiEstimate || 0}%
                </p>
                <p className="text-gray-600 mb-2">
                  <FaMoneyBillWave className="inline-block mr-1" />
                  <strong>Resources:</strong> {`$${idea.resources?.budgetMin || 0} - $${idea.resources?.budgetMax || 0}`}
                </p>
                
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => navigate(`/innovation/idea/${idea._id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    View Details
                  </button>
                  {idea.stage === "development" && (
                    <button
                      onClick={() =>
                        navigate(`/innovation/resource-allocation/${idea._id}`)
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Allocate Resources
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InnovationDashboard;
