import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';
import ApiService from '../services/api';

const FarmsDynamic = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area_hectares: '',
    crop_type: '',
    soil_type: '',
    irrigation_type: ''
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getFarms();
      if (response.success) {
        setFarms(response.farms);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.createFarm(formData);
      if (response.success) {
        await loadFarms();
        setShowAddForm(false);
        setFormData({
          name: '',
          location: '',
          area_hectares: '',
          crop_type: '',
          soil_type: '',
          irrigation_type: ''
        });
        alert('Farm added successfully!');
      }
    } catch (error) {
      console.error('Error adding farm:', error);
      alert('Error adding farm: ' + error.message);
    }
  };

  const handleUpdateFarm = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.updateFarm(editingFarm.id, formData);
      if (response.success) {
        await loadFarms();
        setEditingFarm(null);
        setFormData({
          name: '',
          location: '',
          area_hectares: '',
          crop_type: '',
          soil_type: '',
          irrigation_type: ''
        });
        alert('Farm updated successfully!');
      }
    } catch (error) {
      console.error('Error updating farm:', error);
      alert('Error updating farm: ' + error.message);
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        const response = await ApiService.deleteFarm(farmId);
        if (response.success) {
          await loadFarms();
          alert('Farm deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting farm:', error);
        alert('Error deleting farm: ' + error.message);
      }
    }
  };

  const startEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      area_hectares: farm.area_hectares,
      crop_type: farm.crop_type || '',
      soil_type: farm.soil_type || '',
      irrigation_type: farm.irrigation_type || ''
    });
  };

  const cancelEdit = () => {
    setEditingFarm(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      location: '',
      area_hectares: '',
      crop_type: '',
      soil_type: '',
      irrigation_type: ''
    });
  };

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || farm.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'harvested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Farms</h1>
          <p className="text-gray-600">Manage and monitor all your agricultural properties</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Farm</span>
        </button>
      </div>

      {/* Add/Edit Farm Form */}
      {(showAddForm || editingFarm) && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingFarm ? 'Edit Farm' : 'Add New Farm'}
          </h2>
          <form onSubmit={editingFarm ? handleUpdateFarm : handleAddFarm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter farm name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter farm location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.area_hectares}
                  onChange={(e) => setFormData({...formData, area_hectares: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter farm area in hectares"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                <select
                  value={formData.crop_type}
                  onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select crop type</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Potato">Potato</option>
                  <option value="Tomato">Tomato</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select soil type</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silt">Silt</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Peaty">Peaty</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Type</label>
                <select
                  value={formData.irrigation_type}
                  onChange={(e) => setFormData({...formData, irrigation_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select irrigation type</option>
                  <option value="Canal">Canal</option>
                  <option value="Rainfed">Rain-fed</option>
                  <option value="Drip">Drip</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Flood">Flood</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingFarm ? 'Update Farm' : 'Add Farm'}
              </button>
            </div>
          </form>
        </div>
      )}

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
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="harvested">Harvested</option>
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
                {farm.status || 'active'}
              </span>
            </div>

            {/* Farm Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Area:</span>
                <span className="font-medium">{farm.area_hectares} hectares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Crop:</span>
                <span className="font-medium">{farm.crop_type || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Soil:</span>
                <span className="font-medium">{farm.soil_type || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Irrigation:</span>
                <span className="font-medium">{farm.irrigation_type || 'Not specified'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button 
                onClick={() => startEdit(farm)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button 
                onClick={() => window.location.href = `/add-farm?farm_id=${farm.id}`}
                className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Eye size={16} className="mr-1" />
                Analyze
              </button>
              <button 
                onClick={() => handleDeleteFarm(farm.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFarms.length === 0 && !loading && (
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
          {!searchTerm && filterStatus === 'all' && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus size={20} className="inline mr-2" />
              Add Your First Farm
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmsDynamic;
