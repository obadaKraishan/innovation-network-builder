import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar"; // Import Sidebar

const WellnessEditRecommendation = () => {
  const { recommendationId } = useParams();
  const [recommendation, setRecommendation] = useState({ text: "", url: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const { data } = await api.get(`/wellness/recommendations/${recommendationId}`);
        setRecommendation({
          text: data.recommendationText,
          url: data.resourceUrl || "",
        });
      } catch (error) {
        toast.error("Failed to fetch recommendation details");
      }
    };

    fetchRecommendation();
  }, [recommendationId]);

  const handleUpdateRecommendation = async () => {
    try {
      await api.put(`/wellness/recommendations/${recommendationId}`, recommendation);
      toast.success("Recommendation updated successfully");
      navigate("/wellness/dashboard");
    } catch (error) {
      toast.error("Failed to update recommendation");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Sidebar added */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h1 className="text-3xl font-bold mb-6">Edit Recommendation</h1>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Recommendation Text</label>
              <textarea
                placeholder="Recommendation Text"
                value={recommendation.text}
                onChange={(e) => setRecommendation({ ...recommendation, text: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Resource URL (Optional)</label>
              <input
                type="url"
                placeholder="Resource URL"
                value={recommendation.url}
                onChange={(e) => setRecommendation({ ...recommendation, url: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleUpdateRecommendation}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Update Recommendation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WellnessEditRecommendation;
