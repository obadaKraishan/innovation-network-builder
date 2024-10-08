import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEdit,
  FaTimesCircle,
  FaDownload,
  FaChartLine,
  FaLightbulb,
  FaExclamationTriangle,
  FaTools,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import InnovationFeedbacks from "./InnovationFeedbacks"; // Feedback component
import IdeaVotingSection from "./IdeaVotingSection";
import IdeaSourcesAllocations from "./IdeaSourcesAllocations";
import IdeaStagesTimeline from "./IdeaStagesTimeline";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext"; // Assuming there's an AuthContext for managing roles

const IdeaDetails = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Get the current user and their role
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStage, setNewStage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [allocatedResources, setAllocatedResources] = useState([]); // For resources allocation
  const navigate = useNavigate();

  // Fetch idea details
  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {
        const { data } = await api.get(`/innovation/idea/${id}`);
        setIdea(data);
        setLoading(false);
        setAttachments(data.attachments || []);

        // Ensure voters array and user are present before checking if the user has voted
        if (data.voters && user && user._id) {
          setHasVoted(data.voters.includes(user._id));
        }
      } catch (error) {
        toast.error("Failed to load idea details");
        setLoading(false);
      }
    };

    // Fetch allocated resources
    const fetchAllocatedResources = async () => {
      try {
        const { data } = await api.get(`/innovation/allocated-resources/${id}`);
        setAllocatedResources(data);
      } catch (error) {
        toast.error("Failed to load allocated resources");
      }
    };

    fetchIdeaDetails();
    fetchAllocatedResources(); // Fetch allocated resources when the component loads
  }, [id, user]);

  // Handle updating the idea's stage
  const handleStageUpdate = async (newStage) => {
    try {
      await api.post(`/innovation/update-idea-stage/${id}`, {
        stage: newStage,
      });
      toast.success(`Stage updated to ${newStage} successfully`);
      navigate("/innovation-dashboard");
    } catch (error) {
      toast.error("Failed to update stage");
    }
  };

  // Handle idea withdrawal (for idea owners in submission or review stage)
  const handleWithdrawIdea = async () => {
    try {
      await api.post(`/innovation/withdraw-idea/${id}`);
      toast.success("Idea withdrawn successfully");
      navigate("/innovation-dashboard");
    } catch (error) {
      toast.error("Failed to withdraw idea");
    }
  };

  // Download attachments
  const handleDownloadAttachment = (attachmentUrl) => {
    window.open(attachmentUrl, "_blank");
  };

  // Handle resource allocation (for managers or executives)
  const handleResourceAllocation = async () => {
    try {
      await api.post(`/innovation/allocate-resources`, {
        projectId: id,
        resourcesUsed: allocatedResources,
      });
      toast.success("Resources allocated successfully");
    } catch (error) {
      toast.error("Failed to allocate resources");
    }
  };

  // Handle voting submission and refresh idea details
  const handleVoteSubmitted = (updatedScores) => {
    setIdea((prevIdea) => ({
      ...prevIdea,
      ...updatedScores,
    }));
    setHasVoted(true);
  };

  if (loading) return <div>Loading...</div>;

  // Determine if the user is the idea owner
  const isIdeaOwner = user._id === idea.employeeId._id;

  // Utility to get color based on stage
  const getStageColor = (stage) => {
    switch (stage) {
      case "submission":
        return "gray";
      case "review":
        return "blue";
      case "development":
        return "green";
      case "implementation":
        return "purple";
      case "completed":
        return "teal";
      case "withdrawn":
        return "red";
      default:
        return "gray";
    }
  };

  // Determine the next stage based on the current stage
  const getNextStageOptions = (currentStage) => {
    switch (currentStage) {
      case "submission":
        return [{ label: "Move to Review", value: "review" }];
      case "review":
        return [
          { label: "Approve and Move to Development", value: "development" },
          { label: "Reject Idea", value: "withdrawn" },
        ];
      case "development":
        return [{ label: "Move to Implementation", value: "implementation" }];
      case "implementation":
        return [{ label: "Mark as Completed", value: "completed" }];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg inline-flex items-center hover:bg-gray-600 transition"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          {/* Display Current Stage in a Badge */}
          <span
            className={`badge bg-${getStageColor(
              idea.stage
            )}-500 text-white py-2 px-4 rounded-lg`}
          >
            {idea.stage}
          </span>
        </div>

        {/* Idea Details and Resource Estimates Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Idea Title and Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">{idea.title}</h2>
              <p>
                <FaLightbulb className="inline-block mr-2" />
                <strong>Description:</strong> {idea.description}
              </p>
              <p>
                <FaExclamationTriangle className="inline-block mr-2" />
                <strong>Problem:</strong> {idea.problem}
              </p>
              <p>
                <FaTools className="inline-block mr-2" />
                <strong>Solution:</strong> {idea.solution}
              </p>
              <p>
                <FaChartLine className="inline-block mr-2" />
                <strong>Expected Impact:</strong> {idea.expectedImpact}
              </p>
              <p>
                <strong>ROI Estimate:</strong> {idea.roiEstimate}%
              </p>
              <p>
                <strong>Business Goal Alignment:</strong>{" "}
                {idea.businessGoalAlignment?.join(", ")}
              </p>
              <p>
                <strong>Risk Assessment:</strong> {idea.riskAssessment}
              </p>
              <p>
                <strong>Success Metrics:</strong> {idea.successMetrics}
              </p>
              <p>
                <strong>Expertise Required:</strong> {idea.expertiseRequired}
              </p>
              <p>
                <strong>External Resources:</strong> {idea.externalResources}
              </p>
            </div>

            {/* Resource Estimates */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="font-bold">Resource Estimates</h3>
              <ul className="list-disc pl-6">
                <li>
                  Budget: {idea.resources?.budgetMin} -{" "}
                  {idea.resources?.budgetMax}
                </li>
                <li>Total Time: {idea.resources?.totalTime}</li>
                <li>Delivery Date: {idea.resources?.deliveryDate || "N/A"}</li>
                <li>Manpower: {idea.resources?.manpower}</li>
                <li>
                  Full-Time Employees: {idea.resources?.fullTimeEmployees}
                </li>
                <li>Contractors: {idea.resources?.contractors}</li>
                <li>
                  Tools & Infrastructure:{" "}
                  {idea.resources?.toolsAndInfrastructure}
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Idea Information */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <p>
              <strong>Submitted By:</strong>{" "}
              {idea.employeeId?.name || "Unknown"}
            </p>
            <p>
              <strong>Submitted At:</strong>{" "}
              {new Date(idea.submittedAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Departments:</strong>{" "}
              {idea.department?.map((dept) => dept.name).join(", ") || "None"}
            </p>
          </div>

          {/* Stage Update Section with Timeline */}
          {[
            "CEO",
            "CTO",
            "Executive",
            "Team Leader",
            "Department Manager",
          ].includes(user.role) &&
            idea.stage !== "completed" &&
            idea.stage !== "withdrawn" && (
              <IdeaStagesTimeline
                currentStage={idea.stage}
                handleStageUpdate={handleStageUpdate}
                getNextStageOptions={getNextStageOptions}
              />
          )}

          {/* Attachments Section */}
          {attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Attachments</h3>
              <ul>
                {attachments.map((file, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleDownloadAttachment(file.url)}
                      className="text-blue-500 hover:underline"
                    >
                      <FaDownload className="inline-block mr-1" /> {file.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Scores Overview */}
        {(isIdeaOwner ||
          [
            "Team Leader",
            "Department Manager",
            "CEO",
            "CTO",
            "Executive",
          ].includes(user.role)) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            {/* Title and description for Scores Overview */}
            <h3 className="text-xl font-bold mb-4">Scores Overview</h3>
            <p className="text-gray-600 mb-6">
              Review the overall evaluation scores for this idea, including key
              criteria such as Impact, Feasibility, Cost, and Alignment. These
              scores help prioritize the idea based on the collective feedback
              from leadership.
            </p>

            {/* Score List */}
            <ul className="list-disc pl-6 text-gray-700">
              <li>Impact: {idea.impactScore}</li>
              <li>Feasibility: {idea.feasibilityScore}</li>
              <li>Cost: {idea.costScore}</li>
              <li>Alignment: {idea.alignmentScore}</li>
              <li>Total Priority Score: {idea.priority}</li>
            </ul>
          </div>
        )}

        {/* Feedback Section */}
        {(isIdeaOwner ||
          [
            "Team Leader",
            "Department Manager",
            "Product Manager",
            "Research Scientist",
            "CEO",
            "CTO",
            "Executive",
          ].includes(user.role)) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            {/* Title and description for the feedback section */}
            <h3 className="text-xl font-bold mb-4">Provide Your Feedback</h3>
            <p className="text-gray-600 mb-6">
              Share your thoughts, suggestions, or concerns about this idea.
              Your feedback is valuable in refining the idea and ensuring that
              it aligns with our strategic goals. If you are the idea owner or
              an eligible role, you can provide feedback.
            </p>

            {/* Render Feedback Component for Eligible Users */}
            <InnovationFeedbacks ideaId={id} />
          </div>
        )}

        {/* Voting Section for Eligible Roles */}
        {["CEO", "CTO", "Executive", "Team Leader", "Product Manager"].includes(
          user.role
        ) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            {/* Title and description for the voting section */}
            <h2 className="text-xl font-bold mb-4">Idea Evaluation Voting</h2>
            <p className="text-gray-600 mb-6">
              As a high-level decision maker, you can evaluate this idea based
              on four criteria: Impact, Feasibility, Cost, and Alignment. Please
              score each category on a scale of 0-10, where 0 is the lowest and
              10 is the highest. Your vote will help us prioritize ideas with
              the most potential and strategic alignment.
            </p>

            {/* Idea Voting Section */}
            <IdeaVotingSection
              ideaId={id}
              onVoteSubmitted={handleVoteSubmitted}
              hasVoted={hasVoted} // Pass the hasVoted state here
            />
          </div>
        )}

        {(isIdeaOwner ||
          [
            "Team Leader",
            "Department Manager",
            "CEO",
            "CTO",
            "Executive",
          ].includes(user.role)) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-bold mb-4">Allocated Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allocatedResources && allocatedResources.length > 0 ? (
                allocatedResources.map((resource, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg shadow-md p-4"
                  >
                    <div className="text-lg font-semibold mb-2">
                      Resource Allocation #{index + 1}
                    </div>
                    <div className="mb-2">
                      <strong>Budget:</strong> ${resource.resourcesUsed.budget}
                    </div>
                    <div className="mb-2">
                      <strong>Time:</strong> {resource.resourcesUsed.time}
                    </div>
                    <div className="mb-2">
                      <strong>Manpower:</strong>{" "}
                      {resource.resourcesUsed.manpower}
                    </div>
                    <div className="mb-2">
                      <strong>Estimated Completion Time:</strong>{" "}
                      {resource.estimatedCompletionTime}
                    </div>
                    <div className="mb-2">
                      <strong>Allocated At:</strong>{" "}
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mb-2">
                      <strong>Team Members:</strong>
                      <ul className="list-disc pl-6">
                        {resource.teamMembers.map((member) => (
                          <li key={member._id}>{member.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div>No resources have been allocated yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Allocate Resources Section for Executives */}
        {["CEO", "CTO", "Executive"].includes(user.role) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            {/* Title and description for Allocate Resources section */}
            <h3 className="text-xl font-bold mb-4">Allocate Resources</h3>
            <p className="text-gray-600 mb-6">
              As a high-level executive, you can allocate resources to this
              idea. Provide the necessary resources such as budget, manpower,
              and time allocation for the successful implementation of the idea.
            </p>

            {/* Replace the manual form with the IdeaSourcesAllocations component */}
            <IdeaSourcesAllocations
              projectId={id} // Pass the current idea's ID
              onResourcesAllocated={(allocatedResources) => {
                // Handle the response when resources are allocated successfully
                setAllocatedResources(allocatedResources);
                toast.success("Resources allocated successfully!");
              }}
            />
          </div>
        )}

        {/* User-specific buttons (Idea Owner Actions) */}
        {isIdeaOwner && (
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => navigate(`/edit-idea/${id}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              <FaEdit className="mr-2" /> Edit Idea
            </button>
            <button
              onClick={() => handleWithdrawIdea(id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <FaTimesCircle className="mr-2" /> Withdraw Idea
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetails;
