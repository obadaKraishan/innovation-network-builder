import React from "react";
import {
  FaLightbulb,
  FaClipboardCheck,
  FaWrench,
  FaCogs,
  FaCheckCircle,
} from "react-icons/fa";

const IdeaStagesTimeline = ({
  currentStage,
  handleStageUpdate,
  getNextStageOptions,
}) => {
  const stages = [
    { name: "submission", icon: <FaLightbulb /> },
    { name: "review", icon: <FaClipboardCheck /> },
    { name: "development", icon: <FaWrench /> },
    { name: "implementation", icon: <FaCogs /> },
    { name: "completed", icon: <FaCheckCircle /> },
  ];

  // Helper function to get the correct color for each stage
  const getStageColor = (stageName) => {
    return stageName === currentStage ? "#4CAF50" : "#bbb";
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-6 timeline-section">
      {/* Title and Description */}
      <h3 className="text-xl font-bold mb-4">Project Stage Timeline</h3>
      <p className="text-gray-600 mb-6">
        This section tracks the progress of the idea through its various stages.
        You can update the stage based on the current status of the idea.
      </p>

      <div className="timeline-container mt-10">
        {stages.map((stage, index) => (
          <div key={index} className="timeline-item">
            <div
              className="timeline-icon"
              style={{ backgroundColor: getStageColor(stage.name) }}
            >
              {stage.icon}
            </div>
            <div
              className={`timeline-description ${
                currentStage === stage.name ? "current" : ""
              }`}
            >
              {stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Stage Update Button with more space */}
      {getNextStageOptions(currentStage).map((option) => (
        <div key={option.value} className="stage-update-button">
          <button
            onClick={() => handleStageUpdate(option.value)}
            className="bg-green-500 mt-10 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
          >
            <FaCheckCircle className="mr-2" /> {option.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default IdeaStagesTimeline;
