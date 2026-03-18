import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Car, Users, Bell, 
  Settings, LogOut, TrendingUp, DollarSign,
  PlusCircle
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const MarketerLayout: React.FC = () => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || role !== 'marketer') return <Navigate to="/login" />;

  const menuItems = [
    { name: 'لوحة التحكم', icon: LayoutDashboard, path: '/marketer' },
    { name: 'السيارات المتاحة', icon: Car, path: '/cars' },
    { name: 'عملائي', icon: Users, path: '/marketer/leads' },
    { name: 'التقارير', icon: TrendingUp, path: '/marketer/reports' },
    { name: 'الإشعارات', icon: Bell, path: '/marketer/notifications' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-l border-white/5 p-6 space-y-8">
        <Link to="/" className="flex items-center gap-2 px-2">
          <div className="p-2 bg-amber-500 rounded-lg">
            <Car className="text-zinc-950 w-5 h-5" />
          </div>
          <span className="text-lg font-bold">حسين موتورز</span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MarketerLayout;
