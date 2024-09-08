import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import api from '../utils/api';
import { Line } from 'react-chartjs-2';
import { FaHeartbeat, FaChartLine } from 'react-icons/fa';

// Import chart.js and necessary components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WellnessDashboard = () => {
  const [burnoutRisk, setBurnoutRisk] = useState(0);
  const [stressLevels, setStressLevels] = useState([]);
  const [anonymousFeedback, setAnonymousFeedback] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/wellness/metrics');
        setBurnoutRisk(data.burnoutRisk || 0);
        setStressLevels(data.stressLevels || []);
        setAnonymousFeedback(data.anonymousFeedback || []);
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error('Failed to fetch wellness metrics', error);
      }
    };
    fetchMetrics();
  }, []);

  const stressChartData = {
    labels: stressLevels.length ? stressLevels.map((level) => level.date) : [],
    datasets: [
      {
        label: 'Stress Levels',
        data: stressLevels.length ? stressLevels.map((level) => level.value) : [],
        fill: false,
        borderColor: '#f56565',
      },
    ],
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Add Sidebar */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Wellness Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-red-500 text-white rounded-lg">
              <FaHeartbeat size={24} />
              <h2 className="text-xl font-semibold">Burnout Risk</h2>
              <p className="text-4xl">{burnoutRisk}%</p>
            </div>
            <div className="p-4 bg-blue-500 text-white rounded-lg">
              <FaChartLine size={24} />
              <h2 className="text-xl font-semibold">Stress Levels</h2>
              <Line data={stressChartData} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Anonymous Feedback</h2>
            <ul className="space-y-4 bg-gray-100 p-4 rounded-lg">
              {anonymousFeedback.length ? anonymousFeedback.map((feedback, index) => (
                <li key={index} className="p-2 bg-white shadow rounded">
                  {feedback.text}
                </li>
              )) : <li>No feedback available</li>}
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
            <ul className="space-y-2">
              {recommendations.length ? recommendations.map((recommendation, index) => (
                <li key={index} className="p-2 bg-white shadow rounded">
                  {recommendation.text}
                </li>
              )) : <li>No recommendations available</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;
