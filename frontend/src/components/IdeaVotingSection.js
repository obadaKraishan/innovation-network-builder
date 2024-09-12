import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const IdeaVotingSection = ({ ideaId, onVoteSubmitted }) => {
  const [impact, setImpact] = useState(0);
  const [feasibility, setFeasibility] = useState(0);
  const [cost, setCost] = useState(0);
  const [alignment, setAlignment] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/innovation/idea/${ideaId}/vote`, {
        impact, feasibility, cost, alignment,
      });
      toast.success('Vote submitted successfully');
      onVoteSubmitted(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting vote');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Impact: </label>
        <input type="number" value={impact} onChange={(e) => setImpact(e.target.value)} min="0" max="10" />
      </div>
      <div>
        <label>Feasibility: </label>
        <input type="number" value={feasibility} onChange={(e) => setFeasibility(e.target.value)} min="0" max="10" />
      </div>
      <div>
        <label>Cost: </label>
        <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} min="0" max="10" />
      </div>
      <div>
        <label>Alignment: </label>
        <input type="number" value={alignment} onChange={(e) => setAlignment(e.target.value)} min="0" max="10" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Submit Vote</button>
    </form>
  );
};

export default IdeaVotingSection;
