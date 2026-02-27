import React from 'react';

const EfficiencyGauge = ({ efficiency = 0.82, size = 200 }) => {
  const radius = (size - 20) / 2;
  const strokeWidth = 15;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (efficiency * circumference);

  const getColor = (value) => {
    if (value < 0.5) return '#E53935'; // Red
    if (value < 0.75) return '#FB8C00'; // Orange
    return '#4CAF50'; // Green
  };

  const getLabel = (value) => {
    if (value < 0.5) return 'Needs Improvement';
    if (value < 0.75) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          height={size}
          width={size}
          className="transform -rotate-90"
        >
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            stroke={getColor(efficiency)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(efficiency * 100)}%
          </div>
          <div className="text-sm text-gray-600">Efficiency</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className={`font-semibold ${getColor(efficiency) === '#E53935' ? 'text-danger' : getColor(efficiency) === '#FB8C00' ? 'text-warning' : 'text-secondary'}`}>
          {getLabel(efficiency)}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {efficiency > 0.75 ? 'Above regional average' : 'Below regional average'}
        </div>
      </div>
    </div>
  );
};

export default EfficiencyGauge;
