import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Save, Loader2 } from 'lucide-react';
import ApiService from '../services/api';
import PredictionCard from '../components/PredictionCard';

const AddFarmDynamic = () => {
  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    area_hectares: '',
    crop_type: '',
    soil_type: '',
    irrigation_type: ''
  });
  
  const [analysisData, setAnalysisData] = useState({
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organic_carbon: '',
    sunlight_hours: '',
    wind_speed: '',
    altitude: '',
    fertilizer_used: '',
    pesticide_used: '',
    season: '',
    region: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [existingFarm, setExistingFarm] = useState(null);

  useEffect(() => {
    // Check if editing existing farm
    const urlParams = new URLSearchParams(window.location.search);
    const farmId = urlParams.get('farm_id');
    
    if (farmId) {
      loadFarm(farmId);
    }
  }, []);

  const loadFarm = async (farmId) => {
    try {
      const farms = await ApiService.getFarms();
      if (farms.success) {
        const farm = farms.farms.find(f => f.id == farmId);
        if (farm) {
          setExistingFarm(farm);
          setFarmData({
            name: farm.name,
            location: farm.location,
            area_hectares: farm.area_hectares,
            crop_type: farm.crop_type || '',
            soil_type: farm.soil_type || '',
            irrigation_type: farm.irrigation_type || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading farm:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'farm') {
      setFarmData(prev => ({...prev, [field]: value}));
    } else {
      setAnalysisData(prev => ({...prev, [field]: value}));
    }
  };

  const handleSaveFarm = async () => {
    try {
      setLoading(true);
      
      if (existingFarm) {
        // Update existing farm
        const response = await ApiService.updateFarm(existingFarm.id, farmData);
        if (response.success) {
          alert('Farm updated successfully!');
        }
      } else {
        // Add new farm
        const response = await ApiService.createFarm(farmData);
        if (response.success) {
          alert('Farm added successfully!');
          setExistingFarm({...farmData, id: response.farm_id});
        }
      }
    } catch (error) {
      console.error('Error saving farm:', error);
      alert('Error saving farm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!existingFarm || !existingFarm.id) {
      alert('Please save the farm first before running analysis.');
      return;
    }

    try {
      setAnalyzing(true);
      setPrediction(null);

      // Prepare analysis data
      const analysisInput = {
        ...analysisData,
        temperature: parseFloat(analysisData.temperature) || 25,
        humidity: parseFloat(analysisData.humidity) || 65,
        ph: parseFloat(analysisData.ph) || 6.5,
        rainfall: parseFloat(analysisData.rainfall) || 150,
        nitrogen: parseFloat(analysisData.nitrogen) || 80,
        phosphorus: parseFloat(analysisData.phosphorus) || 60,
        potassium: parseFloat(analysisData.potassium) || 40,
        organic_carbon: parseFloat(analysisData.organic_carbon) || 0.6,
        sunlight_hours: parseFloat(analysisData.sunlight_hours) || 8,
        wind_speed: parseFloat(analysisData.wind_speed) || 10,
        altitude: parseFloat(analysisData.altitude) || 200,
        fertilizer_used: parseFloat(analysisData.fertilizer_used) || 100,
        pesticide_used: parseFloat(analysisData.pesticide_used) || 2.5,
        season: analysisData.season || 'Kharif',
        region: analysisData.region || existingFarm.location
      };

      const response = await ApiService.runFarmerWorkflow({
        ...existingFarm,
        ...analysisInput
      });
      
      if (response.success) {
        setPrediction(response.analysis);
      }
    } catch (error) {
      console.error('Error running analysis:', error);
      alert('Error running analysis: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {existingFarm ? 'Edit Farm' : 'Add New Farm'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveFarm}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>{loading ? 'Saving...' : (existingFarm ? 'Update Farm' : 'Save Farm')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Farm Information Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Farm Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name *</label>
                <input
                  type="text"
                  value={farmData.name}
                  onChange={(e) => handleInputChange('farm', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter farm name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={farmData.location}
                  onChange={(e) => handleInputChange('farm', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter farm location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={farmData.area_hectares}
                  onChange={(e) => handleInputChange('farm', 'area_hectares', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter farm area in hectares"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                <select
                  value={farmData.crop_type}
                  onChange={(e) => handleInputChange('farm', 'crop_type', e.target.value)}
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
                  value={farmData.soil_type}
                  onChange={(e) => handleInputChange('farm', 'soil_type', e.target.value)}
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
                  value={farmData.irrigation_type}
                  onChange={(e) => handleInputChange('farm', 'irrigation_type', e.target.value)}
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
          </div>

          {/* Analysis Input Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Parameters</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                  <input
                    type="number"
                    value={analysisData.temperature}
                    onChange={(e) => handleInputChange('analysis', 'temperature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                  <input
                    type="number"
                    value={analysisData.humidity}
                    onChange={(e) => handleInputChange('analysis', 'humidity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={analysisData.ph}
                    onChange={(e) => handleInputChange('analysis', 'ph', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="6.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
                  <input
                    type="number"
                    value={analysisData.rainfall}
                    onChange={(e) => handleInputChange('analysis', 'rainfall', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen (kg/ha)</label>
                  <input
                    type="number"
                    value={analysisData.nitrogen}
                    onChange={(e) => handleInputChange('analysis', 'nitrogen', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (kg/ha)</label>
                  <input
                    type="number"
                    value={analysisData.phosphorus}
                    onChange={(e) => handleInputChange('analysis', 'phosphorus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (kg/ha)</label>
                  <input
                    type="number"
                    value={analysisData.potassium}
                    onChange={(e) => handleInputChange('analysis', 'potassium', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={analysisData.organic_carbon}
                    onChange={(e) => handleInputChange('analysis', 'organic_carbon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sunlight Hours</label>
                  <input
                    type="number"
                    value={analysisData.sunlight_hours}
                    onChange={(e) => handleInputChange('analysis', 'sunlight_hours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wind Speed (km/h)</label>
                  <input
                    type="number"
                    value={analysisData.wind_speed}
                    onChange={(e) => handleInputChange('analysis', 'wind_speed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Altitude (m)</label>
                  <input
                    type="number"
                    value={analysisData.altitude}
                    onChange={(e) => handleInputChange('analysis', 'altitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fertilizer Used (kg/ha)</label>
                  <input
                    type="number"
                    value={analysisData.fertilizer_used}
                    onChange={(e) => handleInputChange('analysis', 'fertilizer_used', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pesticide Used (kg/ha)</label>
                  <input
                    type="number"
                    value={analysisData.pesticide_used}
                    onChange={(e) => handleInputChange('analysis', 'pesticide_used', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                  <select
                    value={analysisData.season}
                    onChange={(e) => handleInputChange('analysis', 'season', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select season</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <input
                    type="text"
                    value={analysisData.region}
                    onChange={(e) => handleInputChange('analysis', 'region', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter region"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing || !existingFarm}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                <span>{analyzing ? 'Running Analysis...' : 'Run AI Analysis'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Results */}
        {prediction && (
          <div className="mt-8">
            <PredictionCard prediction={prediction} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFarmDynamic;
