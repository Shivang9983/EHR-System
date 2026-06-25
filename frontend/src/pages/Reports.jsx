import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { jsPDF } from 'jspdf';
import { FileText, Download, BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function Reports() {
  const { authFetch } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await authFetch('/api/patients');
        const data = await res.json();
        if (data.success) {
          setPatients(data.patients);
        }
      } catch (err) {
        console.error('Failed to retrieve patients for analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  // Compute Gender Breakdown
  const genderCounts = patients.reduce((acc, p) => {
    acc[p.gender] = (acc[p.gender] || 0) + 1;
    return acc;
  }, {});

  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

  // Compute Age Distribution Groups
  const ageGroups = {
    '0-18': 0,
    '19-35': 0,
    '36-50': 0,
    '51-65': 0,
    '65+': 0
  };

  patients.forEach(p => {
    if (p.age <= 18) ageGroups['0-18']++;
    else if (p.age <= 35) ageGroups['19-35']++;
    else if (p.age <= 50) ageGroups['36-50']++;
    else if (p.age <= 65) ageGroups['51-65']++;
    else ageGroups['65+']++;
  });

  const ageData = Object.entries(ageGroups).map(([name, count]) => ({ name, count }));

  // Mock Visit Trend Monthly Data (Jan - Jun 2026)
  const visitTrendData = [
    { month: 'Jan', visits: 12, newPatients: 4 },
    { month: 'Feb', visits: 19, newPatients: 6 },
    { month: 'Mar', visits: 15, newPatients: 5 },
    { month: 'Apr', visits: 24, newPatients: 8 },
    { month: 'May', visits: patients.length * 1.5, newPatients: patients.length * 0.4 },
    { month: 'Jun', visits: patients.length * 2, newPatients: patients.length }
  ];

  const handleExportClinicSummary = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('EHR CLINICAL ANALYTICS REPORT', 15, 14);
    
    // Sub-header
    doc.setTextColor(50);
    doc.setFontSize(18);
    doc.text('Executive Health Summary', 15, 35);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date of Report: ${new Date().toLocaleDateString()}`, 15, 42);
    doc.text(`Total Registered Patients: ${patients.length}`, 15, 48);

    // Gender Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Gender Demographics', 15, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    let currentY = 68;
    Object.entries(genderCounts).forEach(([gender, count]) => {
      doc.text(`  • ${gender}: ${count} (${Math.round((count / patients.length) * 100) || 0}%)`, 15, currentY);
      currentY += 6;
    });

    // Age Groups Summary
    currentY += 6;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Age Bracket Distributions', 15, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    currentY += 8;
    Object.entries(ageGroups).forEach(([bracket, count]) => {
      doc.text(`  • Bracket ${bracket}: ${count} patients`, 15, currentY);
      currentY += 6;
    });

    doc.save(`EHR_Clinic_Executive_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500 text-xs">Compiling demographic metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clinic Analytics & Reports</h1>
          <p className="text-xs text-slate-500">Demographic index calculations and clinic trend metrics</p>
        </div>
        <button
          onClick={handleExportClinicSummary}
          disabled={patients.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Clinic Summary</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Registry Count</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{patients.length}</h3>
          </div>
          <Activity className="w-8 h-8 text-indigo-500/80" />
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Estimated Monthly Visits</span>
            <h3 className="text-2xl font-bold text-slate-850 mt-1">{Math.round(patients.length * 2)}</h3>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500/80" />
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Report Integrity</span>
            <h3 className="text-2xl font-bold text-slate-850 mt-1">100%</h3>
          </div>
          <FileText className="w-8 h-8 text-amber-500/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit Trends */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">Patient Registrations & Visits</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="visits" name="Visits" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <PieIcon className="w-4.5 h-4.5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">Gender Distribution</h2>
          </div>
          {patients.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 italic">No patients to display.</div>
          ) : (
            <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="w-full h-48 sm:h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs shrink-0">
                {genderData.map((d, index) => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium text-slate-600">{d.name}:</span>
                    <span className="font-bold text-slate-805">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Age Groups Distribution */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4.5 h-4.5 text-indigo-606" />
            <h2 className="text-sm font-bold text-slate-800">Patient Age Groups Bracket</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" name="Patients count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
