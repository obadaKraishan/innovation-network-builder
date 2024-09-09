import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaPlusSquare } from "react-icons/fa";
import Modal from "react-modal";
import ReactPaginate from "react-paginate"; // For pagination
import { useNavigate } from "react-router-dom";

// Set up modal root
Modal.setAppElement("#root");

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const PersonalizedRecommendations = () => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({
    employeeId: "",
    title: "", // New title field
    recommendationText: "",
    resourceUrl: "",
  });
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [pageNumber, setPageNumber] = useState(0); // Pagination state
  const recommendationsPerPage = 5; // Items per page
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchRecommendations = async () => {
        try {
          const endpoint = ["CEO", "Manager"].includes(user.role)
            ? "/wellness/recommendations"
            : `/wellness/recommendations/${user._id}`;

          const [usersRes, recRes] = await Promise.all([
            api.get("/users/message-recipients"),
            api.get(endpoint),
          ]);

          setEmployees(usersRes.data);
          setRecommendations(recRes.data);
        } catch (error) {
          toast.error("Failed to fetch data");
        }
      };

      fetchRecommendations();
    }
  }, [user]);

  const handleAddRecommendation = async () => {
    try {
      const { data } = await api.post(
        "/wellness/recommendations",
        newRecommendation
      );
      setRecommendations([...recommendations, data]);
      toast.success("Recommendation added successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add recommendation");
    }
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this recommendation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/wellness/recommendations/${recommendationId}`);
        setRecommendations(
          recommendations.filter((rec) => rec._id !== recommendationId)
        );
        Swal.fire(
          "Deleted!",
          "The recommendation has been deleted.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the recommendation.", "error");
      }
    }
  };

  // Check if user object is loaded before rendering
  if (!user) {
    return <div>Loading...</div>;
  }

  // Filtering recommendations
  const filteredRecommendations = recommendations.filter((rec) =>
    rec.recommendationText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const pageCount = Math.ceil(
    filteredRecommendations.length / recommendationsPerPage
  );
  const displayRecommendations = filteredRecommendations.slice(
    pageNumber * recommendationsPerPage,
    (pageNumber + 1) * recommendationsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
          onClick={() => navigate(-1)} // Back button functionality
        >
          Back
        </button>
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">
            Personalized Wellness Recommendations
          </h1>

          {/* Admin can add new recommendations */}
          {["CEO", "Manager"].includes(user.role) && (
            <>
              <button
                className="bg-green-500 text-white p-2 rounded-lg flex items-center mb-4"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlusSquare className="mr-2" /> Add New Recommendation
              </button>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={customModalStyles}
                contentLabel="Add Recommendation"
              >
                <h2 className="text-xl font-bold mb-4">
                  Add New Recommendation
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newRecommendation.title}
                      onChange={(e) =>
                        setNewRecommendation({
                          ...newRecommendation,
                          title: e.target.value,
                        })
                      }
                      placeholder="Recommendation Title"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Recommendation Text
                    </label>
                    <textarea
                      value={newRecommendation.recommendationText}
                      onChange={(e) =>
                        setNewRecommendation({
                          ...newRecommendation,
                          recommendationText: e.target.value,
                        })
                      }
                      placeholder="Recommendation Text"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Resource URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="Resource URL"
                      value={newRecommendation.resourceUrl}
                      onChange={(e) =>
                        setNewRecommendation({
                          ...newRecommendation,
                          resourceUrl: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    onClick={handleAddRecommendation}
                  >
                    Add Recommendation
                  </button>
                </div>
              </Modal>
            </>
          )}

          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search recommendations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-lg w-full"
            />
          </div>

          {/* Display recommendations */}
          <ul className="space-y-4">
            {displayRecommendations.map((rec, index) => (
              <li
                key={index}
                className="p-4 bg-gray-100 shadow rounded-lg flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-bold">{rec.title}</h2>
                  <p>{rec.recommendationText}</p>
                  {rec.resourceUrl && (
                    <a
                      href={rec.resourceUrl}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Related Resource
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-500 flex items-center"
                    onClick={() => {
                      console.log(rec); // Check the recommendation object
                      navigate(`/wellness/edit-recommendation/${rec._id}`);
                    }}
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    className="text-red-500 flex items-center"
                    onClick={() => handleDeleteRecommendation(rec._id)}
                  >
                    <FaTrashAlt className="mr-2" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"paginationBtns"}
            previousLinkClassName={"previousBtn"}
            nextLinkClassName={"nextBtn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
