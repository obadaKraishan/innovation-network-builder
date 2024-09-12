import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const IdeaSourcesAllocations = ({ projectId, onResourcesAllocated }) => {
  const [budget, setBudget] = useState("");
  const [time, setTime] = useState("");
  const [manpower, setManpower] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState("");

  const handleAllocateResources = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/innovation/allocate-resources`, {
        projectId,
        budget,
        time,
        manpower,
        teamMembers: teamMembers.split(",").map((member) => member.trim()),
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
      <h3 className="text-xl font-semibold mb-4">Allocate Resources</h3>
      <div className="mb-4">
        <label className="block font-bold mb-2">Budget</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-2 border rounded-lg"
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
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Team Members (comma-separated)</label>
        <input
          type="text"
          value={teamMembers}
          onChange={(e) => setTeamMembers(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Estimated Completion Time</label>
        <input
          type="text"
          value={estimatedCompletionTime}
          onChange={(e) => setEstimatedCompletionTime(e.target.value)}
          className="w-full p-2 border rounded-lg"
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
