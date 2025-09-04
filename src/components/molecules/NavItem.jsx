import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const NavItem = ({ path, label, icon, isActive, isCollapsed }) => {
  return (
    <Link to={path}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        } ${isCollapsed ? 'justify-center' : ''}`}
      >
        <ApperIcon name={icon} size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="ml-3 text-sm font-medium">{label}</span>
        )}
      </motion.div>
    </Link>
  );
};

export default NavItem;