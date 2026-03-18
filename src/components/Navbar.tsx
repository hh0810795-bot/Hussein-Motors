import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Car, User, LogOut, Bell, LayoutDashboard, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';
import { ADMIN_EMAIL } from '../constants';

const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleQuickGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast.success('تم تسجيل الدخول بنجاح');
      
      if (result.user.email === ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        navigate('/marketer');
      }
    } catch (error: any) {
      console.error('Google Login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'السيارات', path: '/cars' },
    { name: 'من نحن', path: '/about' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-2 bg-zinc-900 border border-white/10 rounded-lg group-hover:scale-110 transition-transform">
              <Car className="text-amber-500 w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Hussein <span className="text-amber-500">Motors</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Premium Cars</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-zinc-400 hover:text-amber-500 transition-colors font-medium text-sm"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {role === 'admin' && (
                <Link to="/admin" className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
                  <LayoutDashboard size={16} />
                  لوحة التحكم
                </Link>
              )}
              {role === 'marketer' && (
                <Link to="/marketer" className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
                  <LayoutDashboard size={16} />
                  لوحة المسوق
                </Link>
              )}
              <div className="h-6 w-px bg-white/10 mx-2" />
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleQuickGoogleLogin}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-bold"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                دخول سريع
              </button>
              <Link to="/login" className="btn-primary py-2 px-6 text-sm">
                دخول
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-zinc-900 border-b border-white/10 p-4 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-zinc-400 hover:text-amber-500 py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/5" />
          {user ? (
            <div className="space-y-2">
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="block text-amber-500 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  لوحة التحكم
                </Link>
              )}
              {role === 'marketer' && (
                <Link
                  to="/marketer"
                  className="block text-amber-500 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  لوحة المسوق
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-right text-red-500 py-2"
              >
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/admin"
                className="block text-zinc-500 hover:text-amber-500 py-2 text-sm"
                onClick={() => setIsOpen(false)}
              >
                دخول الإدارة
              </Link>
              <Link
                to="/login"
                className="block btn-primary text-center"
                onClick={() => setIsOpen(false)}
              >
                تسجيل الدخول
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
