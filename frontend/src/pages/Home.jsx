import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Sprout, TrendingUp, Target, Brain } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 lg:py-20">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
          AI-Powered Agricultural
          <span className="text-primary"> Intelligence</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Optimize your farm's yield, predict market trends, and make data-driven decisions with our advanced AI platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
          >
            View Dashboard
            <ArrowRight className="ml-2" size={20} />
          </Link>
          <Link
            to="/add-farm"
            className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-200 text-lg inline-flex items-center justify-center"
          >
            Add New Farm
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="card text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Best Crop Selection</h3>
          <p className="text-gray-600">
            AI analyzes your soil and climate to recommend the perfect crop, preventing planting failures.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Production Forecast</h3>
          <p className="text-gray-600">
            Know exactly how many tons to expect - eliminate surprises and plan your harvest with confidence.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Revenue Prediction</h3>
          <p className="text-gray-600">
            Calculate expected earnings (190,000 EGP/hectare) and plan your finances accurately.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Efficiency Measurement</h3>
          <p className="text-gray-600">
            Detect water waste, fertilizer overuse, and get your efficiency score to optimize resources.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-danger rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Practical Recommendations</h3>
          <p className="text-gray-600">
            Actionable advice: "Reduce water 8%, add nitrogen, wait for better market prices."
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">2,500+</div>
            <div className="text-green-100">Active Farms</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">15%</div>
            <div className="text-green-100">Average Yield Increase</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-green-100">Prediction Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-green-100">AI Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
