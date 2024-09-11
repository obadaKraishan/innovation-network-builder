import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Select from 'react-select';

const IdeaSubmissionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('');
  const [impactType, setImpactType] = useState([]);
  const [department, setDepartment] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [resources, setResources] = useState({
    budgetMin: 0,
    budgetMax: 0,
    totalTime: '',
    deliveryDate: '',
    manpower: 0,
    fullTimeEmployees: 0,
    contractors: 0,
    toolsAndInfrastructure: '',
  });
  const [roiEstimate, setRoiEstimate] = useState(null);
  const [businessGoalAlignment, setBusinessGoalAlignment] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState('');
  const [successMetrics, setSuccessMetrics] = useState('');
  const [expertiseRequired, setExpertiseRequired] = useState('');
  const [externalResources, setExternalResources] = useState('');
  const [attachments, setAttachments] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments/full');
        const departmentOptions = data.map(department => ({
          label: department.name,
          options: department.subDepartments.map(subDept => ({
            value: subDept._id,
            label: subDept.name,
          })),
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('Failed to fetch departments', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleFileUpload = (e) => {
    setAttachments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('problem', problem);
    formData.append('solution', solution);
    formData.append('expectedImpact', expectedImpact);
    formData.append('impactType', impactType.map((option) => option.value).join(', '));
    formData.append('department', department.map((option) => option.value).join(', '));
    formData.append('resources', JSON.stringify(resources));
    formData.append('roiEstimate', roiEstimate);
    formData.append('businessGoalAlignment', businessGoalAlignment.map(option => option.value).join(', '));
    formData.append('riskAssessment', riskAssessment);
    formData.append('successMetrics', successMetrics);
    formData.append('expertiseRequired', expertiseRequired);
    formData.append('externalResources', externalResources);

    if (attachments) {
      for (const file of attachments) {
        formData.append('attachments', file);
      }
    }

    try {
      await api.post('/innovation/submit-idea', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Idea submitted successfully!');
      navigate('/innovation-dashboard');
    } catch (error) {
      toast.error('Failed to submit idea');
    }
  };

  const impactTypes = [
    { label: 'Financial', value: 'Financial' },
    { label: 'Operational', value: 'Operational' },
    { label: 'Customer Satisfaction', value: 'Customer Satisfaction' },
    { label: 'Environmental', value: 'Environmental' },
    { label: 'Technological', value: 'Technological' },
    { label: 'Social', value: 'Social' },
    { label: 'Legal', value: 'Legal' }
  ];

  const businessGoals = [
    { label: 'Increase Revenue', value: 'Increase Revenue' },
    { label: 'Reduce Costs', value: 'Reduce Costs' },
    { label: 'Improve Customer Experience', value: 'Improve Customer Experience' },
    { label: 'Operational Efficiency', value: 'Operational Efficiency' },
    { label: 'Product Innovation', value: 'Product Innovation' },
    { label: 'Expand Market Share', value: 'Expand Market Share' }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-6 flex items-center hover:bg-gray-600"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="bg-white p-6 shadow-lg rounded-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Submit New Idea</h2>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter the idea title"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your idea"
                className="w-full p-3 border rounded-lg"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Problem/Opportunity */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Problem/Opportunity</label>
              <textarea
                value={problem}
                onChange={e => setProblem(e.target.value)}
                placeholder="Describe the problem or opportunity"
                className="w-full p-3 border rounded-lg"
                rows="3"
                required
              />
            </div>

            {/* Suggested Solution */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Suggested Solution</label>
              <textarea
                value={solution}
                onChange={e => setSolution(e.target.value)}
                placeholder="Describe your suggested solution"
                className="w-full p-3 border rounded-lg"
                rows="3"
                required
              />
            </div>

            {/* Expected Impact */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Expected Impact</label>
              <textarea
                value={expectedImpact}
                onChange={e => setExpectedImpact(e.target.value)}
                placeholder="What impact do you expect from this idea?"
                className="w-full p-3 border rounded-lg"
                rows="3"
                required
              />
            </div>

            {/* Impact Type */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Impact Type</label>
              <Select
                value={impactType}
                onChange={setImpactType}
                options={impactTypes}
                placeholder="Select impact type"
                className="w-full"
                isMulti
                isClearable
              />
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Department</label>
              <Select
                value={department}
                onChange={setDepartment}
                options={departments}
                placeholder="Select departments"
                className="w-full"
                isMulti
                isClearable
              />
            </div>

            {/* Resource Estimates */}
            <h3 className="text-lg font-semibold mb-4">Resource Estimates</h3>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Budget (Min/Max)</label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={resources.budgetMin}
                  onChange={e => setResources({ ...resources, budgetMin: e.target.value })}
                  placeholder="Min Budget"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  value={resources.budgetMax}
                  onChange={e => setResources({ ...resources, budgetMax: e.target.value })}
                  placeholder="Max Budget"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Total Time</label>
              <input
                type="text"
                value={resources.totalTime}
                onChange={e => setResources({ ...resources, totalTime: e.target.value })}
                placeholder="Estimated total time"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Expected Delivery Date</label>
              <input
                type="text"
                value={resources.deliveryDate}
                onChange={e => setResources({ ...resources, deliveryDate: e.target.value })}
                placeholder="Expected delivery date"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Manpower (Total)</label>
              <input
                type="number"
                value={resources.manpower}
                onChange={e => setResources({ ...resources, manpower: e.target.value })}
                placeholder="Total manpower"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {/* ROI Estimate */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">ROI Estimate (%)</label>
              <input
                type="number"
                value={roiEstimate}
                onChange={e => setRoiEstimate(e.target.value)}
                placeholder="Enter ROI estimate"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Business Goal Alignment */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Business Goal Alignment</label>
              <Select
                value={businessGoalAlignment}
                onChange={setBusinessGoalAlignment}
                options={businessGoals}
                placeholder="Select business goals"
                className="w-full"
                isMulti
                isClearable
              />
            </div>

            {/* Risk Assessment */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Risk Assessment</label>
              <textarea
                value={riskAssessment}
                onChange={e => setRiskAssessment(e.target.value)}
                placeholder="Describe any potential risks"
                className="w-full p-3 border rounded-lg"
                rows="3"
              />
            </div>

            {/* Success Metrics */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Success Metrics</label>
              <textarea
                value={successMetrics}
                onChange={e => setSuccessMetrics(e.target.value)}
                placeholder="Define success metrics"
                className="w-full p-3 border rounded-lg"
                rows="3"
              />
            </div>

            {/* Expertise Required */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Expertise Required</label>
              <input
                type="text"
                value={expertiseRequired}
                onChange={e => setExpertiseRequired(e.target.value)}
                placeholder="Enter expertise required"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* External Resources */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">External Resources</label>
              <input
                type="text"
                value={externalResources}
                onChange={e => setExternalResources(e.target.value)}
                placeholder="Enter external resources"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* File Attachments */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">File Attachments</label>
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600">
              <FaCheck className="mr-2" /> Submit Idea
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionForm;
