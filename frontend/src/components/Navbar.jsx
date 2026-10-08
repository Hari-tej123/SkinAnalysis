import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Scan, MessageSquare, History, Home, TrendingUp, ScanLine, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Scan Skin', path: '/upload', icon: Scan },
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
    { label: 'History', path: '/history', icon: History },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
    { label: 'Scanner', path: '/scanner', icon: ScanLine },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
              Derm<span className="text-brand-500 font-extrabold">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
              Clinical Skin Lab
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-full border border-slate-200/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-brand-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl px-3 py-1.5">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-xs font-semibold text-brand-700 max-w-[120px] truncate">
                  {user?.full_name || user?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-rose-50 transition-all border border-transparent hover:border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-slate-600 hover:text-brand-700 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-brand-50 transition-all border border-transparent hover:border-brand-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-xl">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-brand-600' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
              <span className="text-[9px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
