import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Component (Handles Desktop & Mobile states) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Layout Area */}
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">
        {/* Header Navigation Bar */}
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
