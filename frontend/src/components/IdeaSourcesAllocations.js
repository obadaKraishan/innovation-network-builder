import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import Select from "react-select"; // Import react-select

const IdeaSourcesAllocations = ({ projectId, onResourcesAllocated }) => {
  const [budget, setBudget] = useState("");
  const [time, setTime] = useState("");
  const [manpower, setManpower] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState("");
  const [users, setUsers] = useState([]); // For fetching users

  // Fetch the users to populate the team members dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users"); // Assuming your backend has a route to fetch all users
        const formattedUsers = data.map(user => ({
          value: user._id,
          label: `${user.name} (${user.position})`, // Format to display name and position
        }));
        setUsers(formattedUsers);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleAllocateResources = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/innovation/allocate-resources`, {
        projectId,
        budget,
        time,
        manpower,
        teamMembers: teamMembers.map(member => member.value), // Extract only the user IDs
        estimatedCompletionTime,
      });
      toast.success("Resources allocated successfully");
      onResourcesAllocated(response.data);
    } catch (error) {
      toast.error("Failed to allocate resources");
    }
  };

  return (
    <form onSubmit={handleAllocateResources} className="p-6 bg-white rounded-lg">
      <div className="mb-4">
        <label className="block font-bold mb-2">Budget</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="e.g. 50000" // Example for budget input
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Time Allocation</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="e.g. 6 months" // Example for time allocation input
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Manpower</label>
        <input
          type="number"
          value={manpower}
          onChange={(e) => setManpower(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="e.g. 10" // Example for manpower input
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Team Members</label>
        <Select
          isMulti
          value={teamMembers}
          onChange={setTeamMembers}
          options={users} // Display the list of users
          className="w-full"
          placeholder="Select team members" // Placeholder for react-select
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Estimated Completion Time</label>
        <input
          type="text"
          value={estimatedCompletionTime}
          onChange={(e) => setEstimatedCompletionTime(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="e.g. 3 months" // Example for estimated completion time
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Allocate Resources
      </button>
    </form>
  );
};

export default IdeaSourcesAllocations;
