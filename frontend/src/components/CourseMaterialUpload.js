import React, { useState } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CourseMaterialUpload = ({
  moduleIndex,
  sectionIndex,
  lessonIndex,
  courseId,
  modules,
  setModules,
  refreshCourse, // Add this prop to trigger re-fetching of course data after upload/delete
}) => {
  const lesson = modules[moduleIndex]?.sections[sectionIndex]?.lessons[lessonIndex];
  const [files, setFiles] = useState([]);
  const [materialType, setMaterialType] = useState('pdf');
  const [title, setTitle] = useState('');

  // Handle new file selection
  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  // Handle material upload
  const handleUpload = async () => {
    if (files.length === 0 || !title) {
      toast.error('Please select materials and provide a title');
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('materials', file);
    });
    formData.append('title', title);
    formData.append('materialType', materialType);

    try {
      const { data } = await api.post(`/courses/upload-materials/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Update only the specific lesson's materials
      const updatedModules = [...modules];
      const targetLesson = updatedModules[moduleIndex].sections[sectionIndex].lessons[lessonIndex];
      if (!targetLesson.materials) {
        targetLesson.materials = [];
      }
      targetLesson.materials.push(...data.materialUrls);
      setModules(updatedModules);
      
      toast.success('Materials uploaded successfully!');
      refreshCourse();  // Refresh course data to ensure all details are updated
    } catch (error) {
      console.error('Error uploading materials:', error);
      toast.error('Failed to upload materials');
    }
  };

  // Handle material deletion
  const handleDeleteMaterial = async (materialIndex) => {
    try {
      const materialToDelete = lesson.materials[materialIndex];
      await api.delete(`/courses/${courseId}/materials/${materialToDelete._id}`);
      const updatedModules = [...modules];
      updatedModules[moduleIndex].sections[sectionIndex].lessons[lessonIndex].materials.splice(materialIndex, 1);
      setModules(updatedModules);
      toast.success('Material deleted successfully!');
      refreshCourse();  // Refresh course data to ensure all details are updated
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  return (
    <div className="mt-6">
      <label className="block text-gray-700">Upload Additional Materials</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter material title"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <select
        value={materialType}
        onChange={(e) => setMaterialType(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      >
        <option value="pdf">PDF</option>
        <option value="ppt">PPT</option>
        <option value="video">Video</option>
      </select>
      <input
        type="file"
        accept=".pdf,.ppt,.pptx"
        multiple
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        type="button"
        onClick={handleUpload}
        className="ml-4 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
      >
        <FaUpload className="mr-2" /> Upload
      </button>

      {/* Display Existing Materials */}
      <div className="mt-4">
        {lesson?.materials?.map((material, index) => (
          <div key={index} className="flex justify-between items-center mb-2 bg-gray-200 p-2 rounded">
            <div>
              <strong>{material.title}</strong> ({material.materialType})
              <a href={material.materialUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">View</a>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteMaterial(index)}
              className="bg-red-500 text-white p-2 rounded flex items-center"
            >
              <FaTrash className="mr-1" /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseMaterialUpload;
