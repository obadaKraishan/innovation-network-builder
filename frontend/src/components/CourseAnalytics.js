import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';

const CourseAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/courses/analytics');
        setAnalytics(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load analytics');
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  const chartData = {
    labels: analytics.dates,
    datasets: [
      {
        label: 'Completion Rates',
        data: analytics.completionRates,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Course Analytics</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
