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
        const { data } = await api.get('/quizzes');
        setQuizzes(data);
      } catch (error) {
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="font-bold text-xl mb-4">All Quizzes</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.quizTitle}</td>
                <td>{quiz.courseId?.title}</td>
                <td>
                  <Link to={`/quizzes/details/${quiz._id}`} className="text-blue-500 mr-2">Details</Link>
                  <Link to={`/quizzes/edit/${quiz._id}`} className="text-green-500 mr-2">Edit</Link>
                  <button onClick={() => handleDelete(quiz._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseQuizzes;
