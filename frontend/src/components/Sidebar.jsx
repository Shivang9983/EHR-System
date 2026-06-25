import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart2, 
  Settings, 
  LogOut, 
  Activity,
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      checkActive: (path) => path === '/dashboard'
    },
    {
      label: 'Patient Registry',
      path: '/patients',
      icon: Users,
      checkActive: (path) => path.startsWith('/patients')
    },
    {
      label: 'Clinic Schedule',
      path: '/appointments',
      icon: Calendar,
      checkActive: (path) => path === '/appointments'
    },
    {
      label: 'Analytics & Reports',
      path: '/reports',
      icon: BarChart2,
      checkActive: (path) => path === '/reports'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      checkActive: (path) => path === '/settings'
    }
  ];

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">PulseEHR</h1>
            <p className="text-[9px] font-bold text-indigo-650 uppercase tracking-wider">Clinical Suite</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.checkActive(location.pathname);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs border-l-3 border-indigo-600 pl-3.5'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Information Profile Banner */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex items-center justify-between gap-3 p-2 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs shrink-0">
              {getInitials(user?.username)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 truncate">{user?.username || 'Clinician'}</h4>
              <span className="inline-block text-[9px] font-extrabold text-indigo-650 tracking-wide uppercase mt-0.5">
                {user?.role || 'Staff'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Mobile Sidebar Slider */}
      <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 h-full transform transition-transform duration-300 ease-in-out select-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
