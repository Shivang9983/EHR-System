import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, LayoutDashboard, Users, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-indigo-600 text-white font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 tracking-wide uppercase block">EHR Clinical</span>
                <span className="text-[10px] text-indigo-600 font-semibold tracking-wider block">Local Portal</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1.5">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/patients"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>Patient Registry</span>
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
              <Shield className="w-3.5 h-3.5" />
              <span>{user.role} Access</span>
            </div>

            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-800">{user.username}</span>
              <span className="block text-[10px] text-slate-500 capitalize">{user.role.toLowerCase()} portal</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
