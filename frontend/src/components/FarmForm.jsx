import React, { useState, useEffect } from 'react';
import { Droplets, Thermometer, Cloud, MapPin, Calculator } from 'lucide-react';

const FarmForm = ({ onPredictionChange, farmId }) => {
  const [formData, setFormData] = useState({
    // Soil & Crop
    soilType: 'clay',
    ph: 6.5,
    nitrogen: 50,
    phosphorus: 30,
    potassium: 40,
    
    // Weather
    temperature: 25,
    rainfall: 100,
    humidity: 60,
    
    // Farm Inputs
    farmArea: 10,
    fertilizerUsed: 200,
    pesticideUsed: 50,
    waterUsage: 1000,
  });

  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runPrediction = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const requestData = {
        temperature: formData.temperature,
        humidity: formData.humidity,
        ph: formData.ph,
        rainfall: formData.rainfall,
        farm_area: formData.farmArea,
        fertilizer_used: formData.fertilizerUsed,
        pesticide_used: formData.pesticideUsed,
        water_usage: formData.waterUsage,
        N: formData.nitrogen,
        P: formData.phosphorus,
        K: formData.potassium,
        farm_id: farmId
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        const predictionData = {
          recommendedCrop: result.data.recommended_crop,
          yield: result.data.predicted_yield,
          revenue: result.data.predicted_revenue,
          efficiency: result.data.efficiency_score,
          confidence: result.data.crop_confidence,
          predictionId: result.data.prediction_id
        };

        setPredictions(predictionData);
        onPredictionChange?.(predictionData);
      } else {
        setError(result.message || 'Prediction failed');
      }
    } catch (err) {
      setError('Error connecting to prediction service');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Soil & Crop Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <span className="text-2xl">🌱</span>
          <span>Soil & Crop</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soil Type
            </label>
            <select
              value={formData.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="silt">Silt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              pH Level: {formData.ph}
            </label>
            <input
              type="range"
              min="4"
              max="9"
              step="0.1"
              value={formData.ph}
              onChange={(e) => handleInputChange('ph', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nitrogen (kg/ha): {formData.nitrogen}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.nitrogen}
              onChange={(e) => handleInputChange('nitrogen', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phosphorus (kg/ha): {formData.phosphorus}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.phosphorus}
              onChange={(e) => handleInputChange('phosphorus', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Potassium (kg/ha): {formData.potassium}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.potassium}
              onChange={(e) => handleInputChange('potassium', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Weather Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Thermometer className="text-warning" size={24} />
          <span>Weather Conditions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (°C): {formData.temperature}
            </label>
            <input
              type="range"
              min="10"
              max="40"
              value={formData.temperature}
              onChange={(e) => handleInputChange('temperature', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rainfall (mm): {formData.rainfall}
            </label>
            <input
              type="range"
              min="0"
              max="500"
              value={formData.rainfall}
              onChange={(e) => handleInputChange('rainfall', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Humidity (%): {formData.humidity}
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={formData.humidity}
              onChange={(e) => handleInputChange('humidity', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Farm Inputs Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Calculator className="text-primary" size={24} />
          <span>Farm Inputs</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Area (hectares): {formData.farmArea}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={formData.farmArea}
              onChange={(e) => handleInputChange('farmArea', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fertilizer Used (kg): {formData.fertilizerUsed}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={formData.fertilizerUsed}
              onChange={(e) => handleInputChange('fertilizerUsed', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pesticide Used (kg): {formData.pesticideUsed}
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={formData.pesticideUsed}
              onChange={(e) => handleInputChange('pesticideUsed', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Usage (m³): {formData.waterUsage}
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={formData.waterUsage}
              onChange={(e) => handleInputChange('waterUsage', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button 
        onClick={runPrediction}
        disabled={loading}
        className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '� Running AI Analysis...' : '�🚀 Run AI Analysis'}
      </button>

      {/* Results Display */}
      {predictions && (
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold mb-4 text-green-800">🎯 Prediction Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-green-700">Recommended Crop:</span>
              <span className="ml-2 text-green-900">{predictions.recommendedCrop}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Expected Yield:</span>
              <span className="ml-2 text-green-900">{predictions.yield.toFixed(1)} tons/hectare</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Expected Revenue:</span>
              <span className="ml-2 text-green-900">EGP {predictions.revenue.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Efficiency Score:</span>
              <span className="ml-2 text-green-900">{(predictions.efficiency * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmForm;
