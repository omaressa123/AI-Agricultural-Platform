import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

const InsightsPanel = ({ farmId }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (farmId) {
      fetchInsights(farmId);
    }
  }, [farmId]);

  const fetchInsights = async (farmId) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/farms/${farmId}/predictions`);
      const result = await response.json();
      
      if (result.status === 'success') {
        // Transform prediction data into insights
        const insightsData = transformPredictionsToInsights(result.data);
        setInsights(insightsData);
      } else {
        setError('Failed to fetch insights');
      }
    } catch (err) {
      setError('Error fetching insights');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const transformPredictionsToInsights = (predictions) => {
    if (!predictions || predictions.length === 0) {
      return [];
    }

    const latestPrediction = predictions[0];
    const insights = [];

    // Crop recommendation insight
    if (latestPrediction.recommendations && latestPrediction.recommendations.length > 0) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: `Best Crop Match: ${latestPrediction.recommendations[0]}`,
        description: `Based on your soil pH ${latestPrediction.ph || 'N/A'} and climate conditions`,
      });
    }

    // Yield insight
    if (latestPrediction.predicted_yield) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: `Expected Yield: ${latestPrediction.predicted_yield.toFixed(1)} tons/hectare`,
        description: 'Based on current soil and weather conditions',
      });
    }

    // Revenue insight
    if (latestPrediction.predicted_revenue) {
      insights.push({
        type: 'success',
        icon: DollarSign,
        title: `Expected Revenue: ${latestPrediction.predicted_revenue.toLocaleString()} EGP`,
        description: 'Based on predicted yield and current market prices',
      });
    }

    // Efficiency insight
    if (latestPrediction.efficiency_score) {
      const efficiencyLevel = latestPrediction.efficiency_score > 0.7 ? 'Excellent' : 
                           latestPrediction.efficiency_score > 0.5 ? 'Good' : 'Needs Improvement';
      
      insights.push({
        type: latestPrediction.efficiency_score > 0.5 ? 'success' : 'warning',
        icon: latestPrediction.efficiency_score > 0.5 ? CheckCircle : AlertTriangle,
        title: `Farm Efficiency: ${efficiencyLevel}`,
        description: `Efficiency score: ${(latestPrediction.efficiency_score * 100).toFixed(1)}%`,
      });
    }

    // Water usage insight (if data available)
    if (latestPrediction.rainfall) {
      insights.push({
        type: 'info',
        icon: Brain,
        title: 'Rainfall Analysis',
        description: `Current rainfall: ${latestPrediction.rainfall}mm - conditions are ${latestPrediction.rainfall > 100 ? 'favorable' : 'dry'}`,
      });
    }

    return insights;
  };

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

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="text-primary" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <div className="flex items-center justify-center h-32 text-gray-500">
          Loading insights...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="text-primary" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <div className="flex items-center justify-center h-32 text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
      </div>
      {insights.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No insights available
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => {
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
      )}
    </div>
  );
};

export default InsightsPanel;
