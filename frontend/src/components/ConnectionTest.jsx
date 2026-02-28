import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic API health check
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/`);
      const data = await response.json();
      
      setApiResponse(data);
      setStatus('✅ Connected to backend successfully!');
    } catch (error) {
      setStatus('❌ Failed to connect to backend');
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold">Status: {status}</p>
          <p className="text-sm text-gray-600 mt-1">
            API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
          </p>
        </div>

        {apiResponse && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2">API Response:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={testConnection}
          className="btn-primary w-full"
        >
          Test Connection Again
        </button>
      </div>
    </div>
  );
};

export default ConnectionTest;
