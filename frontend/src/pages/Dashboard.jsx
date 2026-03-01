import React, { useState, useEffect } from 'react';
import { Wheat, TrendingUp, DollarSign, Target } from 'lucide-react';
import EfficiencyGauge from '../components/EfficiencyGauge';
import PriceTrendChart from '../components/Charts/PriceTrendChart';
import YieldChart from '../components/Charts/YieldChart';
import InsightsPanel from '../components/InsightsPanel';
import ConnectionTest from '../components/ConnectionTest';

const Dashboard = () => {
  const [selectedFarm, setSelectedFarm] = useState('');
  const [farms, setFarms] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch farms on component mount
  useEffect(() => {
    fetchFarms();
  }, []);

  // Fetch dashboard data when farm is selected
  useEffect(() => {
    if (selectedFarm) {
      fetchDashboardData(selectedFarm);
    }
  }, [selectedFarm]);

  const fetchFarms = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/farms`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setFarms(result.data);
        if (result.data.length > 0) {
          setSelectedFarm(result.data[0].id);
        }
      } else {
        setError('Failed to fetch farms');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching farms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (farmId) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/dashboard/${farmId}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setDashboardData(result.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error fetching dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const kpiData = dashboardData?.kpi_data ? [
    {
      title: 'Best Crop Match',
      value: dashboardData.kpi_data.best_crop_match,
      icon: Wheat,
      color: 'bg-secondary',
      textColor: 'text-white',
      unit: 'Recommended',
    },
    {
      title: 'Expected Production',
      value: dashboardData.kpi_data.expected_production?.toFixed(1) || '0',
      icon: TrendingUp,
      color: 'bg-accent',
      textColor: 'text-white',
      unit: 'tons per hectare',
    },
    {
      title: 'Expected Revenue',
      value: dashboardData.kpi_data.expected_revenue?.toLocaleString() || '0',
      icon: DollarSign,
      color: 'bg-warning',
      textColor: 'text-white',
      unit: 'EGP per hectare',
    },
    {
      title: 'Efficiency Score',
      value: dashboardData.kpi_data.efficiency_score?.toFixed(2) || '0',
      icon: Target,
      color: 'bg-primary',
      textColor: 'text-white',
      unit: 'Score',
    },
  ] : [];

  if (loading && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

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
          disabled={farms.length === 0}
        >
          {farms.length === 0 ? (
            <option value="">No farms available</option>
          ) : (
            farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} - {farm.location}
              </option>
            ))
          )}
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
        <PriceTrendChart data={dashboardData?.market_price_trends || []} />
        <YieldChart data={dashboardData?.prediction_history || []} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsightsPanel farmId={selectedFarm} />
        </div>
        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Efficiency Overview</h3>
            <EfficiencyGauge 
              efficiency={dashboardData?.kpi_data?.efficiency_score || 0} 
              size={180} 
            />
          </div>
          <ConnectionTest />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
