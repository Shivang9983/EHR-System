import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onMenuToggle }) {
  const { user } = useAuth();
  const location = useLocation();

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
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D8] select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded-lg border border-[#E8E2D8] text-[#8C7A6E] hover:bg-white hover:text-[#1C1613] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h2 className="text-sm font-extrabold text-[#1C1613] tracking-tight leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {getPageTitle(location.pathname)}
          </h2>
          <p className="text-[10px] text-[#8C7A6E] mt-0.5 hidden sm:block">
            {getPageSubtitle(location.pathname)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E8E2D8] rounded-lg text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider shadow-2xs font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#4A372E]" />
          <span>{formattedDate}</span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAF2ED] border border-[#D5E5D9] rounded-lg text-[10px] font-bold text-[#2D5A43] uppercase tracking-wider shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43] shrink-0" />
          <span className="hidden sm:inline">{user?.role} Mode</span>
          <span className="sm:hidden">{user?.role}</span>
        </div>
      </div>
    </header>
  );
}
