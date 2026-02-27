import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FarmForm from '../components/FarmForm';
import PredictionCard from '../components/PredictionCard';

const AddFarm = () => {
  const [predictions, setPredictions] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePredictionChange = (newPredictions) => {
    setPredictions(newPredictions);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      // Navigate to results or show results
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Farm</h1>
        <p className="text-gray-600">Enter your farm data to get AI-powered recommendations</p>
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">AI Analyzing...</h3>
            <p className="text-gray-600">Processing your farm data to generate insights</p>
          </div>
        </div>
      )}

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Form */}
        <div>
          <FarmForm onPredictionChange={handlePredictionChange} />
        </div>

        {/* Right Side - Live Preview */}
        <div>
          <PredictionCard predictions={predictions} />
        </div>
      </div>
    </div>
  );
};

export default AddFarm;
