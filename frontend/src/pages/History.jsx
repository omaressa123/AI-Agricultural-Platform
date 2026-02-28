import React, { useState } from 'react';
import { Calendar, Filter, Download, Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const History = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedFarm, setSelectedFarm] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisHistory = [
    {
      id: 1,
      date: '2024-02-27',
      farm: 'Farm A',
      crop: 'Wheat',
      type: 'Complete Analysis',
      status: 'completed',
      yield: 23.4,
      revenue: 190000,
      efficiency: 0.82,
      recommendations: 6,
      improvements: ['Water usage reduced by 8%', 'Nitrogen optimized', 'Market timing optimal']
    },
    {
      id: 2,
      date: '2024-02-26',
      farm: 'Farm B',
      crop: 'Corn',
      type: 'Yield Prediction',
      status: 'completed',
      yield: 18.2,
      revenue: 145000,
      efficiency: 0.75,
      recommendations: 4,
      improvements: ['Fertilizer adjusted', 'Irrigation schedule optimized']
    },
    {
      id: 3,
      date: '2024-02-25',
      farm: 'Farm C',
      crop: 'Mixed Vegetables',
      type: 'Efficiency Check',
      status: 'completed',
      yield: 12.5,
      revenue: 95000,
      efficiency: 0.68,
      recommendations: 5,
      improvements: ['Pest control implemented', 'Soil pH corrected']
    },
    {
      id: 4,
      date: '2024-02-20',
      farm: 'Farm A',
      crop: 'Wheat',
      type: 'Complete Analysis',
      status: 'completed',
      yield: 22.1,
      revenue: 180000,
      efficiency: 0.78,
      recommendations: 7,
      improvements: ['Crop rotation suggested', 'Drainage improved']
    },
    {
      id: 5,
      date: '2024-02-15',
      farm: 'Farm B',
      crop: 'Corn',
      type: 'Market Analysis',
      status: 'completed',
      yield: 17.5,
      revenue: 140000,
      efficiency: 0.72,
      recommendations: 3,
      improvements: ['Harvest timing optimized']
    }
  ];

  const filteredHistory = analysisHistory.filter(analysis => {
    const matchesFarm = selectedFarm === 'all' || analysis.farm === selectedFarm;
    return matchesFarm;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="text-green-600" size={16} />;
    if (current < previous) return <TrendingDown className="text-red-600" size={16} />;
    return <Minus className="text-gray-600" size={16} />;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h1>
          <p className="text-gray-600">Track your farm analysis results and improvements over time</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download size={20} />
          <span>Export History</span>
        </button>
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
              <option value="all">All Time</option>
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary mb-1">{filteredHistory.length}</div>
          <div className="text-sm text-gray-600">Total Analyses</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {filteredHistory.length > 0 ? Math.round(filteredHistory.reduce((acc, a) => acc + a.efficiency, 0) / filteredHistory.length * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Avg Efficiency</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {filteredHistory.length > 0 ? Math.round(filteredHistory.reduce((acc, a) => acc + a.recommendations, 0) / filteredHistory.length) : 0}
          </div>
          <div className="text-sm text-gray-600">Avg Recommendations</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {filteredHistory.length > 0 ? Math.round(filteredHistory.reduce((acc, a) => acc + a.improvements.length, 0) / filteredHistory.length) : 0}
          </div>
          <div className="text-sm text-gray-600">Avg Improvements</div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((analysis, index) => {
          const previousAnalysis = filteredHistory[index - 1];
          const yieldChange = previousAnalysis ? analysis.yield - previousAnalysis.yield : 0;
          const efficiencyChange = previousAnalysis ? analysis.efficiency - previousAnalysis.efficiency : 0;

          return (
            <div key={analysis.id} className="card hover:shadow-lg transition-shadow duration-200">
              {/* Analysis Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{analysis.type}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{analysis.date}</span>
                    <span>•</span>
                    <span>{analysis.farm}</span>
                    <span>•</span>
                    <span>{analysis.crop}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                    {analysis.status}
                  </span>
                  <button
                    onClick={() => setSelectedAnalysis(selectedAnalysis === analysis.id ? null : analysis.id)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{analysis.yield}</div>
                  <div className="text-xs text-gray-600">Yield (tons/ha)</div>
                  {yieldChange !== 0 && (
                    <div className="flex items-center justify-center mt-1">
                      {getChangeIcon(analysis.yield, previousAnalysis?.yield)}
                      <span className="text-xs ml-1">{Math.abs(yieldChange).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">EGP {analysis.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{(analysis.efficiency * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-600">Efficiency</div>
                  {efficiencyChange !== 0 && (
                    <div className="flex items-center justify-center mt-1">
                      {getChangeIcon(analysis.efficiency, previousAnalysis?.efficiency)}
                      <span className="text-xs ml-1">{(Math.abs(efficiencyChange) * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{analysis.recommendations}</div>
                  <div className="text-xs text-gray-600">Recommendations</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{analysis.improvements.length}</div>
                  <div className="text-xs text-gray-600">Improvements Made</div>
                </div>
              </div>

              {/* Detailed View */}
              {selectedAnalysis === analysis.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Improvements Implemented</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.improvements.map((improvement, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm text-green-800">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No analysis history found</h3>
          <p className="text-gray-600 mb-4">
            {selectedFarm !== 'all' || timeRange !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by running your first farm analysis'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default History;
