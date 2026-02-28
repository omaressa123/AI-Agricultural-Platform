import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Settings, Bell, Shield, Award, TrendingUp } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const farmerProfile = {
    name: 'Ahmed Mohamed',
    email: 'ahmed.mohamed@farmtech.com',
    phone: '+20 123 456 7890',
    location: 'Nile Delta, Egypt',
    memberSince: '2023-06-15',
    totalFarms: 3,
    totalArea: 30,
    avgEfficiency: 0.75,
    achievements: [
      { id: 1, name: 'Early Adopter', description: 'Joined in first 100 farmers', icon: '🌟' },
      { id: 2, name: 'Efficiency Expert', description: 'Maintained 80%+ efficiency for 6 months', icon: '⚡' },
      { id: 3, name: 'Data Driven', description: 'Used AI recommendations for 50+ decisions', icon: '📊' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Profile Card */}
          <div className="card mb-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{farmerProfile.name}</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <Mail size={16} />
                  <span>{farmerProfile.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone size={16} />
                  <span>{farmerProfile.phone}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin size={16} />
                  <span>{farmerProfile.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">{farmerProfile.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Farms</span>
                <span className="font-medium">{farmerProfile.totalFarms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Area</span>
                <span className="font-medium">{farmerProfile.totalArea} ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Efficiency</span>
                <span className="font-medium text-green-600">{(farmerProfile.avgEfficiency * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Performance Summary</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-green-800">Yield Improvement</span>
                        <span className="font-bold text-green-600">+24%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-800">Cost Reduction</span>
                        <span className="font-bold text-blue-600">-18%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-orange-800">AI Recommendations Used</span>
                        <span className="font-bold text-orange-600">47</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <TrendingUp className="text-green-600" size={20} />
                        <div className="flex-1">
                          <p className="font-medium">Farm A analysis completed</p>
                          <p className="text-sm text-gray-600">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="text-blue-600" size={20} />
                        <div className="flex-1">
                          <p className="font-medium">New recommendations available</p>
                          <p className="text-sm text-gray-600">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive alerts about your farms</p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Alerts</p>
                      <p className="text-sm text-gray-600">Important updates via email</p>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailAlerts ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-600">Urgent alerts via SMS</p>
                    </div>
                    <button
                      onClick={() => setSmsAlerts(!smsAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        smsAlerts ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          smsAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farmerProfile.achievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
