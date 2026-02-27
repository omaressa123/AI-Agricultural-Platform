import React, { useState, useEffect } from 'react';
import { Droplets, Thermometer, Cloud, MapPin, Calculator } from 'lucide-react';

const FarmForm = ({ onPredictionChange }) => {
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

  const [predictions, setPredictions] = useState({
    yield: 23.4,
    revenue: 198900,
    efficiency: 0.82,
  });

  useEffect(() => {
    // Simple prediction calculation based on form data
    const calculatePredictions = () => {
      const baseYield = 20;
      const phFactor = formData.ph >= 6 && formData.ph <= 7.5 ? 1.2 : 0.9;
      const npkFactor = (formData.nitrogen + formData.phosphorus + formData.potassium) / 120;
      const weatherFactor = formData.temperature >= 20 && formData.temperature <= 30 ? 1.1 : 0.95;
      const waterFactor = formData.waterUsage / formData.farmArea >= 80 && formData.waterUsage / formData.farmArea <= 120 ? 1.0 : 0.9;
      
      const predictedYield = baseYield * phFactor * npkFactor * weatherFactor * waterFactor;
      const predictedRevenue = predictedYield * 8500; // Base price per ton
      const efficiency = Math.min(0.95, (predictedYield / 25) * 0.82);

      const newPredictions = {
        yield: predictedYield,
        revenue: Math.round(predictedRevenue),
        efficiency: efficiency,
      };

      setPredictions(newPredictions);
      onPredictionChange?.(newPredictions);
    };

    calculatePredictions();
  }, [formData, onPredictionChange]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

      {/* Submit Button */}
      <button className="btn-primary w-full text-lg py-4">
        🚀 Run AI Analysis
      </button>
    </div>
  );
};

export default FarmForm;
