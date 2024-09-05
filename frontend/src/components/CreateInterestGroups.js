import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import Select from "react-select";
import { FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateInterestGroups = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo')); // Retrieve user info from localStorage
        if (!user || !user.token) {
          throw new Error("User token not found");
        }
  
        const { data } = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${user.token}`, // Attach the token here
          },
        });
        const options = data.map((user) => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }));
        setUserOptions(options);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users.');
      }
    };
  
    fetchUsers();
  }, []);  

  const validateForm = () => {
    if (!name) {
      toast.error("Group name is required");
      return false;
    }
    if (!description) {
      toast.error("Description is required");
      return false;
    }
    if (!objectives) {
      toast.error("Objectives are required");
      return false;
    }
    if (hobbies.length === 0) {
      toast.error("At least one hobby is required");
      return false;
    }
    if (selectedMembers.length === 0) {
      toast.error("At least one member must be selected");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const groupData = {
      name,
      description,
      objectives,
      hobbies: hobbies.map((hobby) => hobby.value),
      members: selectedMembers.map((member) => member.value),
    };

    try {
      const response = await api.post("/groups/create", groupData);
      console.log("Group Created:", response.data);
      toast.success("Group created successfully!");
      navigate("/interest-groups");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <ToastContainer />
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h2 className="text-3xl font-semibold mb-6">
          Create New Interest Group
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Objectives
            </label>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hobbies
            </label>
            <Select
              isMulti
              value={hobbies}
              onChange={setHobbies}
              options={[
                { value: "reading", label: "Reading" },
                { value: "gaming", label: "Gaming" },
                { value: "coding", label: "Coding" },
                { value: "sports", label: "Sports" },
              ]}
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Invite Members
            </label>
            <Select
              isMulti
              value={selectedMembers}
              onChange={setSelectedMembers}
              options={userOptions}
              className="w-full"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <button
              type="button"
              onClick={() => navigate("/interest-groups")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterestGroups;
