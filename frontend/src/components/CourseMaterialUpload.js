import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CourseMaterialUpload = ({ moduleIndex, modules, setModules }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select materials to upload');
      return;
    }
  
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('materials', file);
    });
  
    try {
      const { data } = await api.post(`/courses/upload-materials/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const updatedModules = [...modules];
      if (!updatedModules[moduleIndex].additionalMaterials) {
        updatedModules[moduleIndex].additionalMaterials = [];
      }
      updatedModules[moduleIndex].additionalMaterials.push(...data.materialUrls);
      setModules(updatedModules);
  
      toast.success('Materials uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload materials');
    }
  };  

  return (
    <div className="mt-6">
      <label className="block text-gray-700">Upload Additional Materials</label>
      <div className="flex items-center mt-2">
        <input
          type="file"
          accept=".pdf,.ppt,.pptx"
          multiple
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

export default CourseMaterialUpload;
