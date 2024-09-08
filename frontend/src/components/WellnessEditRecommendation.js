import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const WellnessEditRecommendation = () => {
  const { recommendationId } = useParams();
  const [recommendation, setRecommendation] = useState({ text: '', url: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const { data } = await api.get(`/wellness/recommendations/${recommendationId}`);
        setRecommendation({
          text: data.recommendationText,
          url: data.resourceUrl || '',
        });
      } catch (error) {
        toast.error('Failed to fetch recommendation details');
      }
    };

    fetchRecommendation();
  }, [recommendationId]);

  const handleUpdateRecommendation = async () => {
    try {
      await api.put(`/wellness/recommendations/${recommendationId}`, recommendation);
      toast.success('Recommendation updated successfully');
      navigate('/wellness/dashboard');
    } catch (error) {
      toast.error('Failed to update recommendation');
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Recommendation</h1>
      <textarea
        placeholder="Recommendation Text"
        value={recommendation.text}
        onChange={(e) => setRecommendation({ ...recommendation, text: e.target.value })}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="url"
        placeholder="Resource URL (Optional)"
        value={recommendation.url}
        onChange={(e) => setRecommendation({ ...recommendation, url: e.target.value })}
        className="mb-2 p-2 border rounded"
      />
      <button onClick={handleUpdateRecommendation} className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Recommendation
      </button>
    </div>
  );
};

export default WellnessEditRecommendation;
