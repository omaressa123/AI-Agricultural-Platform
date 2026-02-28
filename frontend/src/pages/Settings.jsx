import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Globe, Shield, Database, Smartphone, Mail, HelpCircle, Save } from 'lucide-react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'Africa/Cairo',
    currency: 'EGP',
    units: 'metric',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      shareData: true,
      analytics: true,
      location: true
    },
    api: {
      endpoint: 'http://localhost:5000',
      timeout: 30,
      retries: 3
    }
  });

  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'api', label: 'API Configuration', icon: Database }
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    // Show success message
    alert('Settings saved successfully!');
  };

  const updateSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your application preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeSection === 'general' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('language', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Africa/Cairo">Egypt (GMT+2)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting('language', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="EGP">Egyptian Pound (EGP)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
                      <select
                        value={settings.units}
                        onChange={(e) => updateSetting('language', 'units', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="metric">Metric (hectares, tons)</option>
                        <option value="imperial">Imperial (acres, pounds)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive analysis results and recommendations</p>
                      </div>
                      <button
                        onClick={() => updateSetting('notifications', 'email', !settings.notifications.email)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.email ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Real-time alerts in your browser</p>
                      </div>
                      <button
                        onClick={() => updateSetting('notifications', 'push', !settings.notifications.push)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.push ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
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
                        onClick={() => updateSetting('notifications', 'sms', !settings.notifications.sms)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.sms ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Marketing Communications</p>
                        <p className="text-sm text-gray-600">Product updates and offers</p>
                      </div>
                      <button
                        onClick={() => updateSetting('notifications', 'marketing', !settings.notifications.marketing)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.marketing ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Data Sharing</p>
                        <p className="text-sm text-gray-600">Share anonymized data to improve AI models</p>
                      </div>
                      <button
                        onClick={() => updateSetting('privacy', 'shareData', !settings.privacy.shareData)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacy.shareData ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacy.shareData ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Usage Analytics</p>
                        <p className="text-sm text-gray-600">Help us improve the application</p>
                      </div>
                      <button
                        onClick={() => updateSetting('privacy', 'analytics', !settings.privacy.analytics)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacy.analytics ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Location Services</p>
                        <p className="text-sm text-gray-600">For weather and local recommendations</p>
                      </div>
                      <button
                        onClick={() => updateSetting('privacy', 'location', !settings.privacy.location)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacy.location ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacy.location ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'api' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">API Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                    <input
                      type="url"
                      value={settings.api.endpoint}
                      onChange={(e) => updateSetting('api', 'endpoint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                      <input
                        type="number"
                        value={settings.api.timeout}
                        onChange={(e) => updateSetting('api', 'timeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
                      <input
                        type="number"
                        value={settings.api.retries}
                        onChange={(e) => updateSetting('api', 'retries', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
