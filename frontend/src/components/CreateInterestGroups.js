import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../utils/api';
import Select from 'react-select';
import { FaSave, FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = yup.object({
  name: yup.string().required('Group name is required'),
  description: yup.string().required('Description is required'),
  objectives: yup.string(),
  hobbies: yup.array().of(yup.string()),
  members: yup.array().of(yup.string()),
});

const CreateInterestGroups = () => {
  const navigate = useNavigate();
  const [userOptions, setUserOptions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        const options = data.map(user => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }));
        setUserOptions(options);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      objectives: '',
      hobbies: [],
      members: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        values.members = selectedMembers.map(member => member.value);
        await api.post('/groups/create', values);
        navigate('/interest-groups');
      } catch (error) {
        console.error('Error creating group:', error);
      }
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-6">Create New Interest Group</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Group Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border border-gray-300 rounded-lg"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Objectives</label>
            <textarea
              name="objectives"
              value={formik.values.objectives}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border border-gray-300 rounded-lg"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Hobbies</label>
            <Select
              isMulti
              name="hobbies"
              options={[
                { value: 'reading', label: 'Reading' },
                { value: 'gaming', label: 'Gaming' },
                { value: 'coding', label: 'Coding' },
                { value: 'sports', label: 'Sports' },
              ]}
              value={formik.values.hobbies}
              onChange={(value) => formik.setFieldValue('hobbies', value)}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Invite Members</label>
            <Select
              isMulti
              options={userOptions}
              value={selectedMembers}
              onChange={setSelectedMembers}
              className="w-full"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <button
              type="button"
              onClick={() => navigate('/interest-groups')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterestGroups;
