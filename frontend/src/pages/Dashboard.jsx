import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, ClipboardList, Calendar, Shield, UserPlus, ArrowRight, Activity, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PatientForm from '../components/PatientForm';

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPatients: 0, totalEncounters: 0, appointmentsToday: 0, activeStaff: 2 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/analytics/dashboard');
      const data = await res.json();

      if (data.success) {
        setRecentPatients(data.recentPatients || []);
        setStats(data.stats || { totalPatients: 0, totalEncounters: 0, appointmentsToday: 0, activeStaff: 2 });
        setChartData(data.trendData || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePatientCreated = (newPatient) => {
    loadDashboardData();
    navigate(`/patients/${newPatient._id}`);
  };

  const quickActions = [
    { label: 'Register Patient', icon: UserPlus, action: () => setIsPatientModalOpen(true), desc: 'Add new clinical chart' },
    { label: 'Clinic Schedule', icon: Calendar, action: () => navigate('/appointments'), desc: 'Manage calendar slots' },
    { label: 'Analytics Reports', icon: Activity, action: () => navigate('/reports'), desc: 'Export executive PDF' },
    { label: 'Portal Settings', icon: Shield, action: () => navigate('/settings'), desc: 'Staff & security policy' }
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-[#1C1613] tracking-tight">
            Welcome back, <span className="text-[#4A372E] font-extrabold">{user?.role === 'Doctor' ? `Dr. ${user?.username}` : user?.username}</span> 👋
          </h1>
          <p className="mt-1 text-xs text-[#8C7A6E]">
            Practice Overview Workspace • Logged in as <span className="font-bold text-[#1C1613] uppercase text-[10px]">{user?.role}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#4A372E] shadow-3xs">
          <span className="w-2 h-2 rounded-full bg-[#2D5A43] animate-pulse" />
          <span>{user?.organizationName || user?.organization?.name || 'Default Health Clinic'}</span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            className="flex flex-col text-left p-4 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#1C1613]/30 rounded-2xl transition-all shadow-3xs cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1613] group-hover:bg-[#1C1613] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <action.icon className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-[#1C1613]">{action.label}</span>
            <span className="text-[10px] text-[#8C7A6E] mt-0.5">{action.desc}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider">Total Patients</span>
            <div className="text-2xl font-extrabold text-[#1C1613] font-mono">{loading ? '—' : stats.totalPatients}</div>
          </div>
          <Users className="w-5 h-5 text-[#4A372E] shrink-0" />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider">Total Encounters</span>
            <div className="text-2xl font-extrabold text-[#1C1613] font-mono">{loading ? '—' : stats.totalEncounters}</div>
          </div>
          <ClipboardList className="w-5 h-5 text-[#2D5A43] shrink-0" />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider">Today's Visits</span>
            <div className="text-2xl font-extrabold text-[#1C1613] font-mono">{loading ? '—' : stats.appointmentsToday}</div>
          </div>
          <Calendar className="w-5 h-5 text-[#B45309] shrink-0" />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider">Active Staff</span>
            <div className="text-2xl font-extrabold text-[#1C1613] font-mono">{loading ? '—' : stats.activeStaff}</div>
          </div>
          <Shield className="w-5 h-5 text-[#8C7A6E] shrink-0" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visit Analytics Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
            <div>
              <h2 className="text-xs font-bold text-[#1C1613] uppercase tracking-wide">Patient Visit & Growth Trends</h2>
              <p className="text-[10px] text-[#8C7A6E] mt-0.5">Historical clinical encounters over past 6 months</p>
            </div>
            <span className="text-[9px] font-bold uppercase bg-[#EAF2ED] text-[#2D5A43] px-2 py-0.5 rounded border border-[#D5E5D9]">
              Live Metrics
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1C1613" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1C1613" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D8" />
                <XAxis dataKey="name" stroke="#8C7A6E" fontSize={10} tickLine={false} />
                <YAxis stroke="#8C7A6E" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E2D8', borderRadius: '8px', fontSize: '11px', color: '#1C1613' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#1C1613" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recently Registered Patients */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h2 className="text-xs font-bold text-[#1C1613] uppercase tracking-wide">Recent Registries</h2>
              <Link to="/patients" className="text-[10px] font-bold text-[#4A372E] hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="text-[#8C7A6E] text-xs py-8 text-center">Loading registries...</div>
            ) : recentPatients.length === 0 ? (
              <div className="text-[#8C7A6E] text-xs py-8 text-center italic">No patients registered.</div>
            ) : (
              <div className="divide-y divide-[#E8E2D8]">
                {recentPatients.map((pat) => (
                  <div key={pat._id} className="py-2.5 flex items-center justify-between text-xs hover:bg-[#FAF7F2] transition-colors rounded-lg px-2">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="font-bold text-[#1C1613] truncate">{pat.firstName} {pat.lastName}</h4>
                      <p className="text-[10px] text-[#8C7A6E] truncate mt-0.5">
                        Age: {pat.age} | Gender: {pat.gender}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/patients/${pat._id}`)}
                      className="px-2.5 py-1 rounded-lg border border-[#E8E2D8] text-[10px] font-bold text-[#4A372E] hover:bg-white hover:border-[#1C1613] transition-colors shrink-0 cursor-pointer shadow-3xs"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E8E2D8]">
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="w-full py-2 bg-[#FAF7F2] hover:bg-white border border-[#E8E2D8] hover:border-[#1C1613] text-[#1C1613] text-xs font-bold rounded-xl transition-all shadow-3xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register New Patient</span>
            </button>
          </div>
        </div>

      </div>

      <PatientForm
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onPatientCreated={handlePatientCreated}
      />
    </div>
  );
}
