import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CourseQASection = () => {
  const { courseId } = useParams();
  const [qa, setQa] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQA = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/qa`);
        setQa(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load Q&A');
        setLoading(false);
      }
    };
    fetchQA();
  }, [courseId]);

  const submitQuestion = async () => {
    try {
      await api.post(`/courses/${courseId}/qa/post`, { questionText: question });
      toast.success('Question posted successfully');
      setQuestion('');
    } catch (error) {
      toast.error('Failed to post question');
    }
  };

  if (loading) {
    return <div>Loading Q&A...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <button onClick={() => window.history.back()} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
          ← Back
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Q&A Section</h2>

          <div className="mb-6">
            <label className="block text-gray-700">Ask a Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Type your question here..."
            />
            <button
              type="button"
              onClick={submitQuestion}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </div> 

          {qa.map((entry, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-100 rounded shadow-md">
              <h3 className="font-bold">{entry.questionText}</h3>
              {entry.answers.length > 0 ? (
                <ul className="mt-2 list-disc list-inside">
                  {entry.answers.map((answer, i) => (
                    <li key={i}>{answer.answerText}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No answers yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseQASection;
