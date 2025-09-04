import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import NavItem from '@/components/molecules/NavItem';
import Button from '@/components/atoms/Button';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/leads', label: 'Leads', icon: 'Users' },
    { path: '/hotlist', label: 'Hotlist', icon: 'Star' },
    { path: '/pipeline', label: 'Pipeline', icon: 'GitBranch' },
    { path: '/contacts', label: 'Contacts', icon: 'Contact' },
    { path: '/analytics', label: 'Analytics', icon: 'TrendingUp' },
    { path: '/calendar', label: 'Calendar', icon: 'Calendar' },
    { path: '/leaderboard', label: 'Leaderboard', icon: 'Trophy' },
    { path: '/teams', label: 'Teams', icon: 'Users2' },
    { path: '/reports', label: 'Reports', icon: 'FileText' }
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout?.();
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Prime Club CRM</span>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={20} 
              className="text-gray-600" 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          {!isCollapsed && user && (
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">
                    {user.firstName?.charAt(0) || user.emailAddress?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.emailAddress}</p>
                </div>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className={`w-full ${isCollapsed ? 'p-2' : ''}`}
          >
            <ApperIcon name="LogOut" size={16} className={isCollapsed ? '' : 'mr-2'} />
            {!isCollapsed && 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;