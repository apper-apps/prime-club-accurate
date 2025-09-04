import { useContext } from 'react';
import Sidebar from "@/components/organisms/Sidebar";
import { AuthContext } from '@/App';

const Layout = ({ children }) => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onLogout={logout} />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;