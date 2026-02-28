import React, { useState } from 'react';
import { Wheat, TrendingUp, DollarSign, Target } from 'lucide-react';
import EfficiencyGauge from '../components/EfficiencyGauge';
import PriceTrendChart from '../components/Charts/PriceTrendChart';
import YieldChart from '../components/Charts/YieldChart';
import InsightsPanel from '../components/InsightsPanel';
import ConnectionTest from '../components/ConnectionTest';

const Dashboard = () => {
  const [selectedFarm, setSelectedFarm] = useState('Farm A');

  const kpiData = [
    {
      title: 'Best Crop Match',
      value: 'Wheat',
      icon: Wheat,
      color: 'bg-secondary',
      textColor: 'text-white',
      unit: '92% suitable',
    },
    {
      title: 'Expected Production',
      value: '23.4',
      icon: TrendingUp,
      color: 'bg-accent',
      textColor: 'text-white',
      unit: 'tons per hectare',
    },
    {
      title: 'Expected Revenue',
      value: '190,000',
      icon: DollarSign,
      color: 'bg-warning',
      textColor: 'text-white',
      unit: 'EGP per hectare',
    },
    {
      title: 'Efficiency Score',
      value: '0.82',
      icon: Target,
      color: 'bg-primary',
      textColor: 'text-white',
      unit: 'Above average',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your farm's performance and AI insights</p>
      </div>

      {/* Farm Selector */}
      <div className="mb-6">
        <select
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="Farm A">Farm A - Wheat Field</option>
          <option value="Farm B">Farm B - Corn Field</option>
          <option value="Farm C">Farm C - Vegetable Garden</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="kpi-card">
              <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={kpi.textColor} size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kpi.value}
                  {kpi.unit && <span className="text-sm font-normal text-gray-600 ml-1">{kpi.unit}</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PriceTrendChart />
        <YieldChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsightsPanel />
        </div>
        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Efficiency Overview</h3>
            <EfficiencyGauge efficiency={0.82} size={180} />
          </div>
          <ConnectionTest />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
