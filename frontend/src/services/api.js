// API service for the AI Agricultural Platform

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  // Farm Management
  static async getFarms() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farms`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching farms:', error);
      throw error;
    }
  }

  static async createFarm(farmData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating farm:', error);
      throw error;
    }
  }

  // Prediction API
  static async predictYield(farmData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict-yield`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error predicting yield:', error);
      throw error;
    }
  }

  // Market Data
  static async getMarketPrices(crop = 'wheat') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/market-prices?crop=${crop}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching market prices:', error);
      throw error;
    }
  }

  // Analytics
  static async getFarmAnalytics(farmId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farms/${farmId}/analytics`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching farm analytics:', error);
      throw error;
    }
  }

  static async getYieldImpactFactors(farmId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farms/${farmId}/yield-factors`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching yield factors:', error);
      throw error;
    }
  }

  // Insights
  static async getAIInsights(farmId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farms/${farmId}/insights`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw error;
    }
  }

  // Complete Farmer Workflow
  static async runFarmerWorkflow(farmData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farmer-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error running farmer workflow:', error);
      throw error;
    }
  }
}

export default ApiService;
