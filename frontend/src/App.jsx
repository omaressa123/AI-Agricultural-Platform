import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  BarChart3, 
  Sprout, 
  TrendingUp, 
  User, 
  Plus, 
  History, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import AddFarm from './pages/AddFarm';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Farms', href: '/farms', icon: Sprout },
    { name: 'Insights', href: '/insights', icon: TrendingUp },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const sidebarActions = [
    { name: 'Add Farm', href: '/add-farm', icon: Plus },
    { name: 'Farm History', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-2 ml-4 lg:ml-0">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sprout className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900">AgriAI</span>
              </div>
            </div>
            <nav className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'bg-secondary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out mt-16 lg:mt-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto py-6 px-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Actions
                </h3>
                <div className="space-y-1">
                  {sidebarActions.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="sidebar-item"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-farm" element={<AddFarm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
