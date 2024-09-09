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

  // Fetch single recommendation data
  useEffect(() => {
    console.log(`Fetching recommendation with ID: ${recommendationId}`);

    const fetchRecommendation = async () => {
      try {
        const response = await api.get(`/wellness/recommendations/${recommendationId}`);
        console.log("API response for fetching recommendation:", response.data);

        if (response.data && response.data._id) {
          setRecommendation({
            title: response.data.title || "",
            recommendationText: response.data.recommendationText || "",
            resourceUrl: response.data.resourceUrl || "",
          });
          console.log("Set recommendation state successfully:", response.data);
        } else {
          toast.error("No recommendation found");
          console.log("No recommendation found with this ID.");
        }
      } catch (error) {
        toast.error("Failed to fetch recommendation details");
        console.error("Error fetching recommendation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [recommendationId]);

  // Handle recommendation update
  const handleUpdateRecommendation = async () => {
    try {
      console.log("Updating recommendation:", recommendation);

      const response = await api.put(`/wellness/recommendations/${recommendationId}`, recommendation);
      console.log("API response for updating recommendation:", response.data);

      toast.success("Recommendation updated successfully");
      navigate("/wellness/dashboard");
    } catch (error) {
      toast.error("Failed to update recommendation");
      console.error("Error updating recommendation:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

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
                  setRecommendation({ ...recommendation, recommendationText: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
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
                  setRecommendation({ ...recommendation, resourceUrl: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();  // Prevent form from submitting
                handleUpdateRecommendation();
              }}
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
