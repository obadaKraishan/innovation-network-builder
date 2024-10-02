import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Sidebar from './Sidebar';

const CourseQuizDetails = () => {
  const { id } = useParams();
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

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="font-bold text-xl mb-4">Quiz Details</h2>
        <p><strong>Title:</strong> {quiz.quizTitle}</p>
        <p><strong>Course:</strong> {quiz.courseId?.title}</p>
        <p><strong>Questions:</strong></p>
        <ul>
          {quiz.questions.map((question, index) => (
            <li key={index}>
              {question.questionText} ({question.type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseQuizDetails;
