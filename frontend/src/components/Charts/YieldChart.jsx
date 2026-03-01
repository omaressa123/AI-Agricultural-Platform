import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const YieldChart = ({ data = [] }) => {
  // Transform API data to chart format
  const chartData = data.slice(0, 5).map((item, index) => ({
    feature: `Prediction ${index + 1}`,
    impact: item.predicted_yield / 100, // Normalize to 0-1 scale
    positive: item.predicted_yield > 0,
    yield: item.predicted_yield,
    date: new Date(item.created_at).toLocaleDateString()
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">{data.date}</p>
          <p className={`font-semibold ${data.positive ? 'text-secondary' : 'text-danger'}`}>
            Yield: {data.yield.toFixed(2)} tons/hectare
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Yield History</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No yield data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Yield History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']}
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}`}
          />
          <YAxis 
            type="category" 
            dataKey="feature" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="impact" 
            fill={(data) => data.positive ? '#4CAF50' : '#E53935'}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary rounded"></div>
          <span className="text-gray-600">Yield Performance</span>
        </div>
      </div>
    </div>
  );
};

export default YieldChart;
