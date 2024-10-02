import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Sidebar from './Sidebar';

const CourseQuizEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/courses/quizzes/${id}`);
        setQuiz(data);
      } catch (error) {
        toast.error('Error fetching quiz');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/courses/quizzes/${id}`, quiz);
      toast.success('Quiz updated successfully');
      navigate('/quizzes');
    } catch (error) {
      toast.error('Error updating quiz');
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="font-bold text-xl mb-4">Edit Quiz</h2>
        <input
          type="text"
          name="quizTitle"
          value={quiz.quizTitle}
          onChange={handleQuizChange}
          className="w-full p-2 border mb-4"
          placeholder="Quiz Title"
        />
        <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded">Save Changes</button>
      </div>
    </div>
  );
};

export default CourseQuizEdit;
