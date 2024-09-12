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
import api from "../utils/api";
import { useAuth } from "../context/AuthContext"; // Assuming there's an AuthContext for managing roles

const IdeaDetails = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Get the current user and their role
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStage, setNewStage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [feedback, setFeedback] = useState(""); // For executives to add feedback
  const [allocatedResources, setAllocatedResources] = useState(""); // For resources allocation
  const navigate = useNavigate();

  // Fetch idea details
  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {
        const { data } = await api.get(`/innovation/idea/${id}`);
        setIdea(data);
        setLoading(false);
        setAttachments(data.attachments || []);
      } catch (error) {
        toast.error("Failed to load idea details");
        setLoading(false);
      }
    };
    fetchIdeaDetails();
  }, [id]);

  // Handle updating the idea's stage
  const handleStageUpdate = async () => {
    try {
      await api.post(`/innovation/update-idea-stage/${id}`, {
        stage: newStage,
      });
      toast.success("Stage updated successfully");
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
      default:
        return "gray";
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
            className="bg-gray-500 text-white py-2 px-4 rounded-lg inline-flex items-center hover:bg-gray-600 transition"
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
                <strong>Suggested Solution:</strong> {idea.solution}
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

        {/* Feedback Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="font-bold mb-4">Feedback</h3>
          {(isIdeaOwner ||
            [
              "Team Leader",
              "Department Manager",
              "Product Manager",
              "Research Scientist",
              "CEO",
              "CTO",
              "Executive",
            ].includes(user.role)) && <InnovationFeedbacks ideaId={id} />}
        </div>

        {/* Manager or higher role functionalities */}
        {[
          "Team Leader",
          "Department Manager",
          "Product Manager",
          "Research Scientist",
        ].includes(user.role) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="font-bold mb-4">Update Stage</h3>
            <label className="block text-gray-700 font-semibold mb-2">
              Update Stage
            </label>
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="">Select new stage</option>
              <option value="development">Development</option>
              <option value="implementation">Implementation</option>
            </select>
            <button
              onClick={handleStageUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
            >
              <FaCheckCircle className="mr-2" /> Update Stage
            </button>
          </div>
        )}

        {/* Approve for Development Section for Executives */}
        {["CEO", "CTO", "Executive"].includes(user.role) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="font-bold mb-4">Actions</h3>

            <button
              onClick={handleStageUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition mt-4"
            >
              <FaCheckCircle className="mr-2" /> Approve for Development
            </button>
          </div>
        )}

        {/* Allocate Resources Section for Executives */}
        {["CEO", "CTO", "Executive"].includes(user.role) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="font-bold mb-4">Allocate Resources</h3>

            <label className="block text-gray-700 font-semibold mb-2">
              Allocate Resources
            </label>
            <textarea
              value={allocatedResources}
              onChange={(e) => setAllocatedResources(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              rows="3"
              placeholder="Allocate resources"
            />
            <button
              onClick={handleResourceAllocation}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600"
            >
              <FaCheckCircle className="mr-2" /> Allocate Resources
            </button>
          </div>
        )}

        {/* Scores Overview */}
        {[
          "Team Leader",
          "Department Manager",
          "CEO",
          "CTO",
          "Executive",
        ].includes(user.role) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="font-bold">Scores Overview</h3>
            <ul className="list-disc pl-6">
              <li>Impact: {idea.impactScore}</li>
              <li>Feasibility: {idea.feasibilityScore}</li>
              <li>Cost: {idea.costScore}</li>
              <li>Alignment: {idea.alignmentScore}</li>
              <li>Total Priority Score: {idea.priority}</li>
            </ul>
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

        {/* Legal Advisor functionalities */}
        {user.role === "Legal Advisor" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <label className="block text-gray-700 font-semibold mb-2">
              Legal Review
            </label>
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="">Select compliance status</option>
              <option value="approved">Approved for Compliance</option>
              <option value="needs-review">Needs Further Review</option>
            </select>
            <button
              onClick={handleStageUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
            >
              <FaCheckCircle className="mr-2" /> Submit Compliance Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetails;
