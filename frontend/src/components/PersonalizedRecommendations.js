import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await api.get('/wellness/recommendations');
        setRecommendations(data);
      } catch (error) {
        toast.error('Failed to fetch recommendations');
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Personalized Wellness Recommendations</h1>
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="p-4 bg-gray-100 shadow rounded-lg">
            <h2 className="text-xl font-bold">Recommendation {index + 1}</h2>
            <p>{recommendation.text}</p>
            {recommendation.resourceUrl && (
              <a href={recommendation.resourceUrl} className="text-blue-500 hover:underline">
                View Related Resource
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
