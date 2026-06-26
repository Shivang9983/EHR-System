import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Calendar, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onMenuToggle }) {
  const { user } = useAuth();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Determine current page title
  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'Dashboard Overview';
    if (pathname === '/patients') return 'Patient Registry';
    if (pathname.startsWith('/patients/')) return 'Patient Chart';
    if (pathname === '/appointments') return 'Clinic Schedule';
    if (pathname === '/reports') return 'Analytics & Reports';
    if (pathname === '/settings') return 'Portal Settings';
    return 'EHR Dashboard';
  };

  const getPageSubtitle = (pathname) => {
    if (pathname === '/dashboard') return 'Clinical metrics and action panel';
    if (pathname === '/patients') return 'Demographics and active medical records';
    if (pathname.startsWith('/patients/')) return 'Encounter charts, timeline and histories';
    if (pathname === '/appointments') return 'Scheduled client checkups and consultations';
    if (pathname === '/reports') return 'Consolidated metric distributions and exports';
    if (pathname === '/settings') return 'Control panel configuration';
    return 'Welcome back to EHR Management';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-2xs select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight">
            {getPageTitle(location.pathname)}
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
            {getPageSubtitle(location.pathname)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-[10px] font-bold text-slate-500 shadow-3xs uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-indigo-650" />
          <span>{formattedDate}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Dark Mode"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg- dark-white border border-indigo-100/80 rounded-lg text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="hidden sm:inline">{user?.role} Active</span>
          <span className="sm:hidden">{user?.role}</span>
        </div>
      </div>
    </header>
  );
}
