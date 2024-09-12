import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const IdeaVotingSection = ({ ideaId, onVoteSubmitted }) => {
  const [impact, setImpact] = useState(0);
  const [feasibility, setFeasibility] = useState(0);
  const [cost, setCost] = useState(0);
  const [alignment, setAlignment] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/innovation/idea/${ideaId}/vote`, {
        impact,
        feasibility,
        cost,
        alignment,
      });
      toast.success("Vote submitted successfully");
      onVoteSubmitted(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting vote");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-50 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-1">Impact</label>
        <input
          type="number"
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          min="0"
          max="10"
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-1">
          Feasibility
        </label>
        <input
          type="number"
          value={feasibility}
          onChange={(e) => setFeasibility(e.target.value)}
          min="0"
          max="10"
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-1">Cost</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          min="0"
          max="10"
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-1">Alignment</label>
        <input
          type="number"
          value={alignment}
          onChange={(e) => setAlignment(e.target.value)}
          min="0"
          max="10"
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200"
      >
        Submit Vote
      </button>
    </form>
  );
};

export default IdeaVotingSection;
