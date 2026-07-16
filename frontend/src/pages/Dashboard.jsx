import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, ClipboardList, Calendar, Shield, UserPlus, FileText, ChevronRight, Settings, BarChart2 } from 'lucide-react';
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

  // Chart dataset is populated from database stats

  const quickActions = [
    { label: 'Register Patient', icon: UserPlus, action: () => setIsPatientModalOpen(true), color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50/70 border-slate-200' },
    { label: 'Clinic Schedule', icon: Calendar, action: () => navigate('/appointments'), color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50/70 border-slate-200' },
    { label: 'Analytics Reports', icon: BarChart2, action: () => navigate('/reports'), color: 'bg-amber-50 text-amber-700 hover:bg-amber-50/70 border-slate-200' },
    { label: 'Portal Settings', icon: Settings, action: () => navigate('/settings'), color: 'bg-slate-100 text-slate-700 hover:bg-slate-100/70 border-slate-200' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-3xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            Welcome back, <span className="text-indigo-600 font-extrabold">{user?.role === 'Doctor' ? `Dr. ${user?.username}` : user?.username}</span> 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Clinical Overview Dashboard • Logged as <span className="font-semibold text-slate-700 capitalize">{user?.role?.toLowerCase()}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-105 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-700">
          <Shield className="w-3.5 h-3.5 text-indigo-650" />
          <span>{user?.role} Access Mode</span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            className={`flex items-center gap-3 p-4 border rounded-xl font-semibold text-xs transition-all shadow-3xs cursor-pointer ${action.color}`}
          >
            <action.icon className="w-5 h-5 shrink-0" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Patients</span>
            <div className="text-2xl font-extrabold text-slate-800">{loading ? '...' : stats.totalPatients}</div>
          </div>
          <Users className="w-5 h-5 text-indigo-600 shrink-0" />
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Encounters</span>
            <div className="text-2xl font-extrabold text-slate-800">{loading ? '...' : stats.totalEncounters}</div>
          </div>
          <ClipboardList className="w-5 h-5 text-emerald-600 shrink-0" />
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Today's Visits</span>
            <div className="text-2xl font-extrabold text-slate-800">{loading ? '...' : stats.appointmentsToday}</div>
          </div>
          <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Active Staff</span>
            <div className="text-2xl font-extrabold text-slate-800">{loading ? '...' : stats.activeStaff}</div>
          </div>
          <Shield className="w-5 h-5 text-slate-500 shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visit Analytics Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Patient Visit Trends</h2>
            <span className="text-[10px] text-slate-450">Active database counts</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="visits" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recently Registered Patients */}
        <div className="lg:col-span-1 p-6 rounded-xl bg-white border border-slate-200 shadow-3xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Recent Registries</h2>
              <Link to="/patients" className="text-[10px] font-bold text-indigo-650 hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="text-slate-500 text-xs py-6 text-center">Loading registries...</div>
            ) : recentPatients.length === 0 ? (
              <div className="text-slate-500 text-xs py-6 text-center italic">No patients registered.</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentPatients.map((pat) => (
                  <div key={pat._id} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-100/10 transition-colors rounded px-1.5">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="font-bold text-slate-800 truncate">{pat.firstName} {pat.lastName}</h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        Age: {pat.age} | Gender: {pat.gender}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/patients/${pat._id}`)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-semibold text-slate-650 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                    >
                      Open Chart
                    </button>
                  </div>
                ))}
              </div>
            )}
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
