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
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [resources, setResources] = useState({
    budget: 0,
    time: '',
    manpower: 0,
    toolsAndInfrastructure: '',
  });
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
    formData.append('department', department?.value);
    formData.append('resources', JSON.stringify(resources));

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

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Department</label>
              <Select
                value={department}
                onChange={setDepartment}
                options={departments}
                placeholder="Select department"
                className="w-full"
                isClearable
              />
            </div>

            <h3 className="text-lg font-semibold mb-4">Resource Estimates</h3>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Budget</label>
              <input
                type="number"
                value={resources.budget}
                onChange={e => setResources({ ...resources, budget: e.target.value })}
                placeholder="Enter estimated budget"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Time</label>
              <input
                type="text"
                value={resources.time}
                onChange={e => setResources({ ...resources, time: e.target.value })}
                placeholder="Estimated time to complete"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Manpower</label>
              <input
                type="number"
                value={resources.manpower}
                onChange={e => setResources({ ...resources, manpower: e.target.value })}
                placeholder="Estimated manpower required"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Tools & Infrastructure</label>
              <input
                type="text"
                value={resources.toolsAndInfrastructure}
                onChange={e => setResources({ ...resources, toolsAndInfrastructure: e.target.value })}
                placeholder="Enter tools & infrastructure required"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">File Attachments</label>
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                className="w-full p-3 border rounded-lg"
              />
            </div>

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
