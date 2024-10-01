import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Sidebar from './Sidebar';

const CourseQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await api.get('/courses/quizzes');
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error.response || error.message);
        toast.error('Error fetching quizzes');
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error('Error deleting quiz');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="font-bold text-2xl mb-6 text-gray-700">All Quizzes</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <tr key={quiz._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quiz.quizTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.courseId?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/quizzes/details/${quiz._id}`} className="text-blue-500 hover:text-blue-700 mr-4">
                        Details
                      </Link>
                      <Link to={`/quizzes/edit/${quiz._id}`} className="text-green-500 hover:text-green-700 mr-4">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No quizzes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseQuizzes;
