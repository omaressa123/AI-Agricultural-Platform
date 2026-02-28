import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Calendar, Filter, Download } from 'lucide-react';

const Insights = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedFarm, setSelectedFarm] = useState('all');

  const insights = [
    {
      id: 1,
      type: 'success',
      title: 'Optimal Planting Window Identified',
      description: 'Based on weather patterns, next 7 days are ideal for wheat planting',
      impact: 'High',
      date: '2024-02-27',
      farm: 'Farm A'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Water Usage Above Optimal',
      description: 'Current irrigation is 15% higher than needed for current growth stage',
      impact: 'Medium',
      date: '2024-02-27',
      farm: 'Farm A'
    },
    {
      id: 3,
      type: 'info',
      title: 'Market Price Trend Analysis',
      description: 'Wheat prices expected to increase 8% in next 2 weeks',
      impact: 'High',
      date: '2024-02-26',
      farm: 'All Farms'
    },
    {
      id: 4,
      type: 'success',
      title: 'Nitrogen Levels Optimal',
      description: 'Soil tests show perfect nitrogen balance for current crop',
      impact: 'Medium',
      date: '2024-02-25',
      farm: 'Farm B'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Pest Pressure Increasing',
      description: 'Weather conditions favor aphid development - monitor closely',
      impact: 'High',
      date: '2024-02-25',
      farm: 'Farm C'
    },
    {
      id: 6,
      type: 'info',
      title: 'Efficiency Improvement Detected',
      description: 'Overall farm efficiency improved 12% compared to last season',
      impact: 'High',
      date: '2024-02-24',
      farm: 'All Farms'
    }
  ];

  const getInsightIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-green-600" size={20} />;
      case 'warning': return <AlertTriangle className="text-orange-600" size={20} />;
      case 'info': return <Brain className="text-blue-600" size={20} />;
      default: return <Brain className="text-gray-600" size={20} />;
    }
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInsights = insights.filter(insight => {
    const matchesFarm = selectedFarm === 'all' || insight.farm === selectedFarm || insight.farm === 'All Farms';
    return matchesFarm;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Insights</h1>
        <p className="text-gray-600">Get intelligent recommendations and alerts for your farms</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-600" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Farms</option>
              <option value="Farm A">Farm A</option>
              <option value="Farm B">Farm B</option>
              <option value="Farm C">Farm C</option>
            </select>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map(insight => (
          <div key={insight.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Insight Header */}
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {insight.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{insight.date}</span>
                  <span>•</span>
                  <span>{insight.farm}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                {insight.impact} Impact
              </span>
            </div>

            {/* Insight Content */}
            <p className="text-gray-700 leading-relaxed">
              {insight.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                Take Action
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">12</div>
          <div className="text-sm text-gray-600">Actionable Insights</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">3</div>
          <div className="text-sm text-gray-600">Warnings</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">85%</div>
          <div className="text-sm text-gray-600">Recommendations Applied</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary mb-1">24%</div>
          <div className="text-sm text-gray-600">Efficiency Improvement</div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
