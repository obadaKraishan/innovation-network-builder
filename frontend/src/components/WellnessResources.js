import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaPlusSquare } from "react-icons/fa";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate"; // For pagination

// Make sure to set up Modal's root element
Modal.setAppElement("#root");

const customStyles = {
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

const WellnessResources = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    title: "",
    category: "",
    url: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search
  const [filterCategory, setFilterCategory] = useState(""); // State for category filter
  const [pageNumber, setPageNumber] = useState(0); // Pagination state
  const resourcesPerPage = 5; // Number of resources per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await api.get("/wellness/resources");
        setResources(data);
      } catch (error) {
        toast.error("Failed to fetch resources");
      }
    };
    fetchResources();
  }, []);

  const handleAddResource = async () => {
    try {
      const resourceData = {
        resourceTitle: newResource.title,
        resourceCategory: newResource.category,
        resourceURL: newResource.url,
      };

      const { data } = await api.post("/wellness/resources", resourceData);
      setResources([...resources, data]);
      toast.success("Resource added successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add resource");
    }
  };

  const handleDeleteResource = async (resourceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this resource?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/wellness/resources/${resourceId}`);
        setResources(
          resources.filter((resource) => resource._id !== resourceId)
        );
        toast.success("Resource deleted successfully");
      } catch (error) {
        toast.error("Failed to delete resource");
      }
    }
  };

  const filteredResources = resources
    .filter((resource) => {
      // Filter by search term
      if (!searchTerm) return true;
      return (
        resource.resourceTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        resource.resourceCategory
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    })
    .filter((resource) => {
      // Filter by category
      if (!filterCategory) return true;
      return resource.resourceCategory === filterCategory;
    });

  // Pagination logic
  const pageCount = Math.ceil(filteredResources.length / resourcesPerPage);
  const displayResources = filteredResources.slice(
    pageNumber * resourcesPerPage,
    (pageNumber + 1) * resourcesPerPage
  );

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // Check if the user object is available before rendering
  if (!user) {
    return <div>Loading...</div>; // Show loading state while waiting for user context
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
            onClick={() => navigate(-1)} // Back button functionality
          >
            Back
          </button>
          <h1 className="text-2xl font-bold mb-4">Wellness Resources</h1>

          {/* Admin can add new resources */}
          {["CEO", "Manager"].includes(user.role) && (
            <>
              <button
                className="bg-green-500 text-white p-2 rounded-lg flex items-center mb-4"
                onClick={() => setIsModalOpen(true)} // Open modal for new resource
              >
                <FaPlusSquare className="mr-2" /> Add New Resource
              </button>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={customStyles}
                contentLabel="Add Resource"
              >
                <h2 className="text-xl font-bold mb-4">Add New Resource</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Resource Title
                    </label>
                    <input
                      type="text"
                      placeholder="Resource Title"
                      value={newResource.title}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Resource Category
                    </label>
                    <input
                      type="text"
                      placeholder="Resource Category"
                      value={newResource.category}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          category: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Resource URL
                    </label>
                    <input
                      type="url"
                      placeholder="Resource URL"
                      value={newResource.url}
                      onChange={(e) =>
                        setNewResource({ ...newResource, url: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    onClick={handleAddResource}
                  >
                    Add Resource
                  </button>
                </div>
              </Modal>
            </>
          )}

          {/* Search and filter */}
          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-lg w-1/3"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {Array.from(
                new Set(resources.map((resource) => resource.resourceCategory))
              ).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Display resources */}
          <div>
            <ul className="space-y-4">
              {displayResources.map((resource) => (
                <li
                  key={resource._id}
                  className="p-4 bg-gray-100 shadow rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-xl font-bold">
                      {resource.resourceTitle || "Unknown Title"}
                    </h2>
                    <p>
                      Category:{" "}
                      {resource.resourceCategory || "Unknown Category"}
                    </p>
                    <p>Created By: {resource.createdBy?.name || "Unknown"}</p>
                    <p>
                      Created On:{" "}
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                    <a
                      href={resource.resourceURL}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Resource
                    </a>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-500 flex items-center"
                      onClick={() =>
                        navigate(`/wellness/edit-resource/${resource._id}`)
                      }
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      className="text-red-500 flex items-center"
                      onClick={() => handleDeleteResource(resource._id)}
                    >
                      <FaTrashAlt className="mr-2" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

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

export default WellnessResources;
