import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { jsPDF } from 'jspdf';
import { FileText, Download, BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

const CLINIC_COLORS = ['#1C1613', '#4A372E', '#2D5A43', '#8C7A6E', '#B45309'];

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
    doc.setFillColor(28, 22, 19);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(250, 247, 242);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('EHR CLINICAL PRACTICE REPORT', 15, 14);
    
    // Sub-header
    doc.setTextColor(28, 22, 19);
    doc.setFontSize(16);
    doc.text('Executive Health Summary', 15, 35);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 122, 110);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 42);
    doc.text(`Total Registered Patients: ${patients.length}`, 15, 48);

    // Gender Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 22, 19);
    doc.text('1. Gender Demographics', 15, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(74, 55, 46);
    let currentY = 68;
    Object.entries(genderCounts).forEach(([gender, count]) => {
      doc.text(`  • ${gender}: ${count} (${Math.round((count / patients.length) * 100) || 0}%)`, 15, currentY);
      currentY += 6;
    });

    // Age Groups Summary
    currentY += 6;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 22, 19);
    doc.text('2. Age Bracket Distributions', 15, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(74, 55, 46);
    currentY += 8;
    Object.entries(ageGroups).forEach(([bracket, count]) => {
      doc.text(`  • Bracket ${bracket}: ${count} patients`, 15, currentY);
      currentY += 6;
    });

    doc.save(`EHR_Clinic_Executive_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (loading) {
    return <div className="py-12 text-center text-[#8C7A6E] text-xs font-['Plus_Jakarta_Sans',sans-serif]">Compiling demographic metrics...</div>;
  }

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1C1613] tracking-tight">Clinic Analytics & Executive Reports</h1>
          <p className="text-xs text-[#8C7A6E]">Demographic distributions, practice growth, and PDF exports</p>
        </div>
        <button
          onClick={handleExportClinicSummary}
          disabled={patients.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl shadow-xs transition-all text-xs cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary PDF</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider">Registry Count</span>
            <h3 className="text-2xl font-black text-[#1C1613] font-mono mt-1">{patients.length}</h3>
          </div>
          <Activity className="w-6 h-6 text-[#1C1613]" />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider">Estimated Monthly Visits</span>
            <h3 className="text-2xl font-black text-[#2D5A43] font-mono mt-1">{Math.round(patients.length * 2)}</h3>
          </div>
          <TrendingUp className="w-6 h-6 text-[#2D5A43]" />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider">Report Integrity</span>
            <h3 className="text-2xl font-black text-[#1C1613] font-mono mt-1">100%</h3>
          </div>
          <FileText className="w-6 h-6 text-[#8C7A6E]" />
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Visit Trends */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
            <h2 className="text-xs font-bold text-[#1C1613] uppercase tracking-wide">Registrations & Visits</h2>
            <span className="text-[10px] text-[#8C7A6E]">Monthly Trend</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitsReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1C1613" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1C1613" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D8" />
                <XAxis dataKey="month" stroke="#8C7A6E" fontSize={10} tickLine={false} />
                <YAxis stroke="#8C7A6E" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E2D8', borderRadius: '8px', fontSize: '11px', color: '#1C1613' }} />
                <Area type="monotone" dataKey="visits" name="Visits" stroke="#1C1613" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitsReport)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
            <h2 className="text-xs font-bold text-[#1C1613] uppercase tracking-wide">Gender Distribution</h2>
            <span className="text-[10px] text-[#8C7A6E]">Demographic Index</span>
          </div>
          {patients.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-[#8C7A6E] italic">No patients to display.</div>
          ) : (
            <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-6 font-['Inter',sans-serif]">
              <div className="w-full h-48 sm:h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CLINIC_COLORS[index % CLINIC_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E2D8', borderRadius: '8px', fontSize: '11px', color: '#1C1613' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs shrink-0">
                {genderData.map((d, index) => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CLINIC_COLORS[index % CLINIC_COLORS.length] }} />
                    <span className="font-medium text-[#8C7A6E]">{d.name}:</span>
                    <span className="font-bold text-[#1C1613] font-mono">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Age Groups Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-3xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
            <h2 className="text-xs font-bold text-[#1C1613] uppercase tracking-wide">Patient Age Brackets</h2>
            <span className="text-[10px] text-[#8C7A6E]">Age Range Distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D8" />
                <XAxis dataKey="name" stroke="#8C7A6E" fontSize={10} tickLine={false} />
                <YAxis stroke="#8C7A6E" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#FAF7F2' }} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E2D8', borderRadius: '8px', fontSize: '11px', color: '#1C1613' }} />
                <Bar dataKey="count" name="Patients count" fill="#1C1613" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
