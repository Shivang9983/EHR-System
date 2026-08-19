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
  HeartPulse,
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
    <div className="flex flex-col h-full bg-white border-r border-[#E8E2D8]">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D8] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1C1613] text-[#FAF7F2] shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#1C1613] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              EHR Clinical Suite
            </h1>
            <p className="text-[9px] font-bold text-[#8C7A6E] uppercase tracking-wider">Practice OS</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 rounded-lg text-[#8C7A6E] hover:bg-[#FAF7F2] hover:text-[#1C1613] transition-colors"
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
                isActive
                  ? 'bg-[#1C1613] text-white shadow-xs font-bold'
                  : 'text-[#8C7A6E] hover:bg-[#FAF7F2] hover:text-[#1C1613]'
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-[#8C7A6E] group-hover:text-[#1C1613]'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Information Profile Banner */}
      <div className="p-4 border-t border-[#E8E2D8] bg-[#FAF7F2] shrink-0">
        <div className="flex items-center justify-between gap-3 p-2.5 bg-white border border-[#E8E2D8] rounded-xl shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1613] font-bold text-xs shrink-0 font-mono">
              {getInitials(user?.username)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#1C1613] truncate font-['Plus_Jakarta_Sans',sans-serif]">
                {user?.username || 'Clinician'}
              </h4>
              <span className="inline-block text-[9px] font-bold text-[#8C7A6E] tracking-wide uppercase">
                {user?.role || 'Staff'} Role
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-[#8C7A6E] hover:bg-[#FDF2F2] hover:text-[#991B1B] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
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
          className="md:hidden fixed inset-0 z-40 bg-[#1C1613]/40 backdrop-blur-xs transition-opacity duration-300"
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
