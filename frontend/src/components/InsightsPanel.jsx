import React from 'react';
import { Brain, AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const InsightsPanel = ({ insights = [] }) => {
  const defaultInsights = [
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Nitrogen Level Optimal',
      description: 'Current nitrogen levels are perfect for wheat cultivation',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Reduce Water by 7%',
      description: 'Current water usage exceeds optimal levels by 7%',
    },
    {
      type: 'success',
      icon: TrendingUp,
      title: 'Market Trend Increasing',
      description: 'Wheat prices expected to rise 12% in next quarter',
    },
    {
      type: 'info',
      icon: Brain,
      title: 'Efficiency Above Regional Average',
      description: 'Your farm efficiency is 15% higher than regional average',
    },
  ];

  const insightsData = insights.length > 0 ? insights : defaultInsights;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-secondary',
          textColor: 'text-green-800',
        };
      case 'warning':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          iconColor: 'text-warning',
          textColor: 'text-orange-800',
        };
      case 'danger':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-danger',
          textColor: 'text-red-800',
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
        };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
      </div>
      <div className="space-y-3">
        {insightsData.map((insight, index) => {
          const styles = getTypeStyles(insight.type);
          const Icon = insight.icon;
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${styles.bgColor} ${styles.borderColor}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`${styles.iconColor} mt-0.5`} size={20} />
                <div className="flex-1">
                  <h4 className={`font-semibold ${styles.textColor} mb-1`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;
