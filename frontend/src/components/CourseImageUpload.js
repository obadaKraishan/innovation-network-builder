import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CourseImageUpload = ({ setCourseImage }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/courses/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCourseImage(data.imageUrl); // Assuming the backend returns the image URL
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="mt-6">
      <label className="block text-gray-700">Upload Course Image</label>
      <div className="flex items-center mt-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleUpload}
          className="ml-4 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
        >
          <FaUpload className="mr-2" /> Upload
        </button>
      </div>
    </div>
  );
};

export default CourseImageUpload;
