import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const YieldChart = ({ data = [] }) => {
  const defaultData = [
    { feature: 'Nitrogen', impact: 0.25, positive: true },
    { feature: 'Water', impact: -0.15, positive: false },
    { feature: 'pH Level', impact: 0.18, positive: true },
    { feature: 'Temperature', impact: 0.12, positive: true },
    { feature: 'Rainfall', impact: -0.08, positive: false },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className={`font-semibold ${data.positive ? 'text-secondary' : 'text-danger'}`}>
            {data.positive ? '+' : ''}{(data.impact * 100).toFixed(1)}% impact
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Yield Impact Factors</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            type="number" 
            domain={[-0.3, 0.3]}
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <YAxis 
            type="category" 
            dataKey="feature" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            width={80}
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
          <span className="text-gray-600">Positive Impact</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-danger rounded"></div>
          <span className="text-gray-600">Negative Impact</span>
        </div>
      </div>
    </div>
  );
};

export default YieldChart;
