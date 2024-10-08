import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import { Line } from "react-chartjs-2";
import {
  FaHeartbeat,
  FaChartLine,
  FaPlusSquare,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

// Import chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WellnessDashboard = () => {
  const { user } = useContext(AuthContext); // Get user context to determine role
  const [loading, setLoading] = useState(true);
  const [burnoutRisk, setBurnoutRisk] = useState(0);
  const [stressLevels, setStressLevels] = useState([]);
  const [anonymousFeedback, setAnonymousFeedback] = useState([]);
  const [nonAnonymousFeedback, setNonAnonymousFeedback] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [surveys, setSurveys] = useState([]);

  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get("/wellness/metrics");
        setBurnoutRisk(data.burnoutRisk || 0);
        setStressLevels(data.stressLevels || []);
        setAnonymousFeedback(data.anonymousFeedback || []);
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error("Failed to fetch wellness metrics", error);
      }
    };

    const fetchSurveys = async () => {
      try {
        const { data } = await api.get("/wellness/all-surveys");
        setSurveys(data);
      } catch (error) {
        console.error("Failed to fetch surveys", error);
      }
    };

    const fetchUserFeedback = async () => {
      try {
        const { data } = await api.get(`/wellness/user-feedback/${user._id}`);
        setUserFeedback(data);
      } catch (error) {
        console.error("Failed to fetch user feedback", error);
      }
    };

    const fetchNonAnonymousFeedback = async () => {
      try {
        const { data } = await api.get("/wellness/non-anonymous-feedback");
        setNonAnonymousFeedback(data);
      } catch (error) {
        console.error("Failed to fetch non-anonymous feedback", error);
      }
    };

    const fetchAnonymousFeedback = async () => {
      try {
        const { data } = await api.get("/wellness/anonymous-feedback");
        setAnonymousFeedback(data);
      } catch (error) {
        console.error("Failed to fetch anonymous feedback", error);
      }
    };

    const fetchResourcesAndRecommendations = async () => {
      try {
        const resourceEndpoint = "/wellness/resources";
        const recommendationEndpoint = ["CEO", "Manager"].includes(user.role)
          ? "/wellness/recommendations" // Fetch all recommendations for higher roles
          : `/wellness/recommendations/${user._id}`; // Fetch only user's recommendations for other roles

        const [resourcesRes, recommendationsRes] = await Promise.all([
          api.get(resourceEndpoint),
          api.get(recommendationEndpoint),
        ]);

        console.log("Resources:", resourcesRes.data);
        console.log("Recommendations:", recommendationsRes.data);

        setResources(resourcesRes.data);
        setRecommendations(recommendationsRes.data);
      } catch (error) {
        console.error("Error fetching resources or recommendations:", error);
      }
    };

    if (user) {
      fetchMetrics();
      fetchSurveys();
      fetchUserFeedback();
      fetchNonAnonymousFeedback();
      fetchAnonymousFeedback();
      fetchResourcesAndRecommendations();
      setLoading(false);
    }
  }, [user]);

  // Delete resource
  const handleDeleteResource = async (resourceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this resource?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/wellness/resources/${resourceId}`);
        setResources(
          resources.filter((resource) => resource._id !== resourceId)
        );
        Swal.fire("Deleted!", "The resource has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the resource.", "error");
      }
    }
  };

  // Delete recommendation
  const handleDeleteRecommendation = async (recommendationId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this recommendation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/wellness/recommendations/${recommendationId}`);
        setRecommendations(
          recommendations.filter((rec) => rec._id !== recommendationId)
        );
        Swal.fire(
          "Deleted!",
          "The recommendation has been deleted.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the recommendation.", "error");
      }
    }
  };

  // Helper function to handle rendering feedback responses
  const renderFeedbackResponses = (feedback) => {
    return feedback
      .map((fb) => {
        if (typeof fb.response === "object") {
          return Array.isArray(fb.response)
            ? fb.response.join(", ") // Handle array feedback
            : JSON.stringify(fb.response, null, 2); // Handle object feedback
        }
        return fb.response; // Handle regular strings
      })
      .join(", ");
  };

  // Safeguard for missing employeeId or feedback responses
  const renderFeedbackItem = (feedback, surveyTitle, feedbackDate) => {
    if (!feedback || !feedback._id) {
      return null;
    }

    // Safely check if employeeId exists before accessing it
    const isOwnFeedback =
      feedback.employeeId &&
      feedback.employeeId._id &&
      feedback.employeeId._id.toString() === user._id.toString();

    // Display employee name or fallback to 'Unknown Employee' for missing employeeId
    const employeeName =
      feedback.anonymous && !isOwnFeedback
        ? "Anonymous"
        : feedback.employeeId && feedback.employeeId.name
        ? feedback.employeeId.name
        : "Unknown Employee";

    const validDate = feedbackDate
      ? new Date(feedbackDate).toLocaleString()
      : "Invalid Date";
    const feedbackResponses = renderFeedbackResponses(feedback.feedback);

    return (
      <li
        key={feedback._id}
        className="p-2 bg-white shadow rounded flex justify-between items-center"
      >
        <div>
          <strong>Feedback from: {employeeName}</strong>
          <p>Survey: {surveyTitle || "Unknown Survey"}</p>
          <p>Submitted on: {validDate}</p>
          <p>Feedback: {feedbackResponses}</p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/wellness/feedback-details/${feedback._id}`)}
        >
          View Details
        </button>
      </li>
    );
  };

  // Handle survey deletion
  const handleDeleteSurvey = async (surveyId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this survey?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/wellness/surveys/${surveyId}`);
        setSurveys(surveys.filter((survey) => survey._id !== surveyId));
        Swal.fire("Deleted!", "The survey has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the survey.", "error");
      }
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const stressChartData = {
    labels: stressLevels.length ? stressLevels.map((level) => level.date) : [],
    datasets: [
      {
        label: "Stress Levels",
        data: stressLevels.length
          ? stressLevels.map((level) => level.value)
          : [],
        fill: false,
        borderColor: "#f56565",
      },
    ],
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Add Sidebar */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Wellness Dashboard</h1>

          {/* Management-specific features */}
          {[
            "CEO",
            "CTO",
            "Director",
            "Department Manager",
            "Team Leader",
          ].includes(user.role) && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Management Dashboard
                  </h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg flex items-center"
                    onClick={() => navigate("/wellness/create-survey")} // Redirect to Create Survey
                  >
                    <FaPlusSquare className="mr-2" /> Create Survey
                  </button>
                  <button
                    className="bg-green-500 text-white p-2 rounded-lg flex items-center"
                    onClick={() => navigate("/wellness/resources")} // Redirect to Add Resource
                  >
                    <FaPlusSquare className="mr-2" /> Resources
                  </button>
                  <button
                    className="bg-green-500 text-white p-2 rounded-lg flex items-center"
                    onClick={() => navigate("/wellness/recommendations")} // Redirect to Add Recommendation
                  >
                    <FaPlusSquare className="mr-2" /> Recommendations
                  </button>
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-red-500 text-white rounded-lg">
                  <FaHeartbeat size={24} />
                  <h2 className="text-xl font-semibold">Burnout Risk</h2>
                  <p className="text-4xl">{burnoutRisk}%</p>
                </div>
                <div className="p-4 bg-blue-500 text-white rounded-lg">
                  <FaChartLine size={24} />
                  <h2 className="text-xl font-semibold">Stress Levels</h2>
                  <Line data={stressChartData} />
                </div>
              </div>

              {/* Manage Resources Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Wellness Resources
                </h2>
                <ul className="space-y-4 bg-gray-100 p-4 rounded-lg">
                  {resources.length > 0 ? (
                    resources.map((resource) => (
                      <li
                        key={resource._id}
                        className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-xl font-bold">
                            {resource.resourceTitle || "Unknown Title"}
                          </h3>
                          <p>
                            Category:{" "}
                            {resource.resourceCategory || "Unknown Category"}
                          </p>
                          <p>
                            Created By: {resource.createdBy?.name || "Unknown"}
                          </p>
                          <p>
                            Created On:{" "}
                            {resource.createdAt
                              ? new Date(
                                  resource.createdAt
                                ).toLocaleDateString()
                              : "Invalid Date"}
                          </p>
                          <a
                            href={resource.resourceURL}
                            className="text-blue-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Resource
                          </a>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 flex items-center"
                            onClick={() =>
                              navigate(
                                `/wellness/edit-resource/${resource._id}`
                              )
                            }
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            className="text-red-500 flex items-center"
                            onClick={() => handleDeleteResource(resource._id)}
                          >
                            <FaTrashAlt className="mr-2" /> Delete
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>No resources available</li>
                  )}
                </ul>
              </div>

              {/* Manage Recommendations Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Personalized Recommendations
                </h2>
                <ul className="space-y-4 bg-gray-100 p-4 rounded-lg">
                  {recommendations.length > 0 ? (
                    recommendations.map((recommendation) => (
                      <li
                        key={recommendation._id}
                        className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p>{recommendation.recommendationText}</p>
                          <p>
                            Created By:{" "}
                            {recommendation.employeeId?.name || "Unknown"}
                          </p>
                          <p>
                            Created On:{" "}
                            {new Date(
                              recommendation.createdAt
                            ).toLocaleDateString()}
                          </p>
                          {recommendation.resourceUrl && (
                            <a
                              href={recommendation.resourceUrl}
                              className="text-blue-500"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Related Resource
                            </a>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 flex items-center"
                            onClick={() =>
                              navigate(
                                `/wellness/edit-recommendation/${recommendation._id}`
                              )
                            }
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            className="text-red-500 flex items-center"
                            onClick={() =>
                              handleDeleteRecommendation(recommendation._id)
                            }
                          >
                            <FaTrashAlt className="mr-2" /> Delete
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>No recommendations available</li>
                  )}
                </ul>
              </div>

              {/* Anonymous Feedback Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Anonymous Feedback
                </h2>
                <ul className="space-y-4 bg-gray-100 p-4 rounded-lg">
                  {anonymousFeedback.length ? (
                    anonymousFeedback.map((feedback) =>
                      renderFeedbackItem(
                        feedback,
                        feedback.surveyId?.title,
                        feedback.createdAt
                      )
                    )
                  ) : (
                    <li>No anonymous feedback available</li>
                  )}
                </ul>
              </div>

              {/* Non-Anonymous Feedback Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Non-Anonymous Feedback
                </h2>
                <ul className="space-y-4 bg-gray-100 p-4 rounded-lg">
                  {nonAnonymousFeedback.length ? (
                    nonAnonymousFeedback.map((feedback) =>
                      renderFeedbackItem(
                        feedback,
                        feedback.surveyId?.title,
                        feedback.createdAt
                      )
                    )
                  ) : (
                    <li>No non-anonymous feedback available</li>
                  )}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">All Surveys</h2>
                <ul className="space-y-4 bg-gray-100 p-4 rounded-lg">
                  {surveys.length ? (
                    surveys.map((survey) => (
                      <li
                        key={survey._id}
                        className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-xl font-bold">{survey.title}</h3>
                          <p>
                            Created At:{" "}
                            {new Date(survey.createdAt).toLocaleString()}
                          </p>
                          <p>{survey.surveyQuestions.length} Questions</p>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            className="text-blue-500 flex items-center"
                            onClick={() =>
                              navigate(`/wellness/edit-survey/${survey._id}`)
                            }
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>

                          <button
                            className="text-red-500 flex items-center"
                            onClick={() => handleDeleteSurvey(survey._id)}
                          >
                            <FaTrashAlt className="mr-2" /> Delete
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>No surveys available</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {/* Employee-specific features */}
          {[
            "Employee",
            "Customer Support Specialist",
            "Research Scientist",
          ].includes(user.role) && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Wellness</h2>
                <button
                  className="bg-green-500 text-white p-2 rounded-lg flex items-center"
                  onClick={() => navigate("/wellness/submit-feedback")} // Redirect to Submit Feedback
                >
                  <FaPlusSquare className="mr-2" /> Submit Feedback
                </button>
              </div>

              {/* User Feedback Section */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Your Previous Feedback
                </h2>
                <ul className="space-y-4 bg-gray-100 p-4 rounded-lg">
                  {userFeedback.length ? (
                    userFeedback.map((feedback) =>
                      renderFeedbackItem(
                        feedback,
                        feedback.surveyId?.title,
                        feedback.createdAt
                      )
                    )
                  ) : (
                    <li>No previous feedback available</li>
                  )}
                </ul>
              </div>

              {/* Personalized Recommendations Section */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Personalized Recommendations
                </h2>
                <ul className="space-y-2">
                  {recommendations.length ? (
                    recommendations.map((recommendation) => (
                      <li
                        key={recommendation._id}
                        className="p-2 bg-white shadow rounded"
                      >
                        {recommendation.recommendationText}
                      </li>
                    ))
                  ) : (
                    <li>No recommendations available</li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;
