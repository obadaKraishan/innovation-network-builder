import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "./Sidebar";
import api from "../utils/api";
import { toast } from "react-toastify";

const SubmitFeedback = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [isAnonymous, setIsAnonymous] = useState(false); // State for anonymous checkbox
  const navigate = useNavigate(); // Initialize navigate

  // Fetch surveys on component mount
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { data } = await api.get("/wellness/all-surveys");
        console.log("Fetched surveys:", data); // Debugging log
        setSurveys(data);
      } catch (error) {
        toast.error("Failed to fetch surveys");
        console.error("Error fetching surveys:", error); // Error log
      }
    };
    fetchSurveys();
  }, []);

  // Handle feedback change for each question
  const handleFeedbackChange = (questionId, value) => {
    console.log("Handling feedback change:", { questionId, value }); // Debugging log
    setFeedback({ ...feedback, [questionId]: value });
  };

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting feedback:", { selectedSurvey, feedback, isAnonymous }); // Debugging log

    const feedbackArray = Object.entries(feedback).map(([questionId, response]) => ({
      questionId,
      response,
    }));

    console.log("Feedback array to be submitted:", feedbackArray); // Debugging log

    try {
      const { data } = await api.post("/wellness/submit-feedback", {
        surveyId: selectedSurvey,
        feedback: feedbackArray,
        anonymous: isAnonymous, // Pass the isAnonymous value to the backend
      });
      console.log("Feedback submission response:", data); // Debugging log for submission response
      toast.success("Feedback submitted successfully");
      navigate("/wellness-dashboard");
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error("Error submitting feedback:", error); // Error log
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
          ← Back
        </button>

        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Submit Wellness Feedback</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Select Survey</label>
              <select
                value={selectedSurvey || ""}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
              >
                <option value="">Select a survey...</option>
                {surveys.map((survey) => (
                  <option key={survey._id} value={survey._id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedSurvey && (
              <>
                {surveys
                  .find((survey) => survey._id === selectedSurvey)
                  .surveyQuestions.map((question, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-gray-700">{question.label}</label>

                      {question.type === "text" && (
                        <input
                          type="text"
                          value={feedback[question._id] || ""}
                          onChange={(e) => handleFeedbackChange(question._id, e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded"
                        />
                      )}

                      {question.type === "radio" &&
                        question.options.map((option, i) => (
                          <div key={i}>
                            <label>
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={feedback[question._id] === option}
                                onChange={() => handleFeedbackChange(question._id, option)}
                                className="mr-2"
                              />
                              {option}
                            </label>
                          </div>
                        ))}

                      {question.type === "checkbox" &&
                        question.options.map((option, i) => (
                          <div key={i}>
                            <label>
                              <input
                                type="checkbox"
                                value={option}
                                onChange={(e) => {
                                  const newFeedback = [...(feedback[question._id] || [])];
                                  if (e.target.checked) {
                                    handleFeedbackChange(question._id, [...newFeedback, option]);
                                  } else {
                                    handleFeedbackChange(
                                      question._id,
                                      newFeedback.filter((opt) => opt !== option)
                                    );
                                  }
                                }}
                                className="mr-2"
                              />
                              {option}
                            </label>
                          </div>
                        ))}

                      {question.type === "select" && (
                        <select
                          value={feedback[question._id]?.trim() || ""}
                          onChange={(e) => handleFeedbackChange(question._id, e.target.value.trim())}
                          className="w-full p-3 border border-gray-300 rounded"
                        >
                          <option value="">Select an option...</option>
                          {question.options.map((option, i) => (
                            <option key={i} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {question.type === "date" && (
                        <input
                          type="date"
                          value={feedback[question._id] || ""}
                          onChange={(e) => handleFeedbackChange(question._id, e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded"
                        />
                      )}
                    </div>
                  ))}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mr-2"
                    />
                    Submit Anonymously
                  </label>
                </div>
                <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg">
                  Submit Feedback
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;
