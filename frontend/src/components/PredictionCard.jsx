import React from 'react';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import EfficiencyGauge from './EfficiencyGauge';

const PredictionCard = ({ predictions = {} }) => {
  const defaultPredictions = {
    yield: 23.4,
    revenue: 198900,
    efficiency: 0.82,
  };

  const data = { ...defaultPredictions, ...predictions };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Live Prediction Preview</h3>
      
      <div className="space-y-6">
        {/* Yield Prediction */}
        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Estimated Yield</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.yield.toFixed(1)} <span className="text-sm font-normal text-gray-600">ton/ha</span>
            </p>
          </div>
        </div>

        {/* Revenue Prediction */}
        <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
          <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Revenue Estimate</p>
            <p className="text-2xl font-bold text-gray-900">
              EGP {data.revenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Efficiency Gauge */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Efficiency Score</p>
          <EfficiencyGauge efficiency={data.efficiency} size={160} />
        </div>

        {/* Additional Insights */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Quick Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-gray-600">
                {data.efficiency > 0.75 ? 'Above' : 'Below'} regional average efficiency
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-gray-600">
                Optimal for {data.yield > 20 ? 'wheat' : 'corn'} cultivation
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-gray-600">
                Market conditions {data.revenue > 150000 ? 'favorable' : 'challenging'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
