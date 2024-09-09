import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const WellnessEditRecommendation = () => {
  const { recommendationId } = useParams();
  const [recommendation, setRecommendation] = useState({
    title: "",
    recommendationText: "",
    resourceUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await api.get(`/wellness/recommendations/${recommendationId}`);
        if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
          setRecommendation({
            title: response.data.title || "",
            recommendationText: response.data.recommendationText || "",
            resourceUrl: response.data.resourceUrl || "",
          });
        } else {
          toast.error("Invalid recommendation data");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle expired or invalid token
          toast.error("Session expired. Please log in again.");
          navigate("/login"); // Redirect to login if unauthorized
        } else {
          toast.error("Failed to fetch recommendation details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [recommendationId, navigate]);

  const handleUpdateRecommendation = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/wellness/recommendations/${recommendationId}`, recommendation);
      if (response.status === 200) {
        toast.success("Recommendation updated successfully");
        navigate("/wellness/personalized-recommendations"); // Ensure correct route
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login"); // Redirect to login if unauthorized
      } else {
        toast.error("Failed to update recommendation");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h1 className="text-3xl font-bold mb-6">Edit Recommendation</h1>

          <form className="space-y-6" onSubmit={handleUpdateRecommendation}>
            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Recommendation Title"
                value={recommendation.title}
                onChange={(e) =>
                  setRecommendation({ ...recommendation, title: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">
                Recommendation Text
              </label>
              <textarea
                placeholder="Recommendation Text"
                value={recommendation.recommendationText}
                onChange={(e) =>
                  setRecommendation({
                    ...recommendation,
                    recommendationText: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">
                Resource URL (Optional)
              </label>
              <input
                type="url"
                placeholder="Resource URL"
                value={recommendation.resourceUrl}
                onChange={(e) =>
                  setRecommendation({
                    ...recommendation,
                    resourceUrl: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
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
