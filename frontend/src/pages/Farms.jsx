import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, TrendingUp } from 'lucide-react';

const Farms = () => {
  const [farms, setFarms] = useState([
    {
      id: 1,
      name: 'Farm A - Wheat Field',
      location: 'Nile Delta',
      area: 10,
      crop: 'Wheat',
      status: 'Active',
      lastAnalysis: '2024-02-27',
      efficiency: 0.82,
      expectedYield: 23.4,
      expectedRevenue: 190000
    },
    {
      id: 2,
      name: 'Farm B - Corn Field',
      location: 'Alexandria',
      area: 15,
      crop: 'Corn',
      status: 'Active',
      lastAnalysis: '2024-02-26',
      efficiency: 0.75,
      expectedYield: 18.2,
      expectedRevenue: 145000
    },
    {
      id: 3,
      name: 'Farm C - Vegetable Garden',
      location: 'Giza',
      area: 5,
      crop: 'Mixed Vegetables',
      status: 'Planning',
      lastAnalysis: '2024-02-25',
      efficiency: 0.68,
      expectedYield: 12.5,
      expectedRevenue: 95000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || farm.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Harvested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency > 0.8) return 'text-green-600';
    if (efficiency > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Farms</h1>
          <p className="text-gray-600">Manage and monitor all your agricultural properties</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add New Farm</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search farms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Harvested">Harvested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarms.map(farm => (
          <div key={farm.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Farm Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                  <MapPin size={16} />
                  <span>{farm.location}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farm.status)}`}>
                {farm.status}
              </span>
            </div>

            {/* Farm Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Area:</span>
                <span className="font-medium">{farm.area} hectares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Crop:</span>
                <span className="font-medium">{farm.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency:</span>
                <span className={`font-medium ${getEfficiencyColor(farm.efficiency)}`}>
                  {(farm.efficiency * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expected Yield:</span>
                <span className="font-medium">{farm.expectedYield} tons/ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expected Revenue:</span>
                <span className="font-medium text-green-600">
                  EGP {farm.expectedRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Run Analysis
              </button>
            </div>

            {/* Last Analysis */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <Calendar size={16} />
                <span>Last Analysis</span>
              </div>
              <span className="text-gray-900">{farm.lastAnalysis}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFarms.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No farms found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first farm'
            }
          </p>
          {(!searchTerm && filterStatus === 'all') && (
            <button className="btn-primary">
              <Plus size={20} className="inline mr-2" />
              Add Your First Farm
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Farms;
