import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Calendar, 
  FileText, 
  BarChart2, 
  Upload, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Clock, 
  Layers, 
  Database, 
  Server, 
  Shield, 
  FileCheck, 
  Cpu, 
  ChevronRight, 
  FileSignature, 
  Download, 
  UserCheck, 
  Mic, 
  Eye, 
  ExternalLink,
  Code2,
  Check,
  Zap
} from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scribe');
  const [activeRole, setActiveRole] = useState('Doctor');
  const [copiedDemo, setCopiedDemo] = useState(false);

  const featureShowcase = {
    scribe: {
      title: 'AI Ambient Clinical Scribe (Gemini 2.5)',
      badge: '2026 AI Innovation',
      desc: 'Convert unstructured doctor-patient dialogue and live voice dictation into standardized, audit-ready SOAP notes with automated vital sign extraction.',
      points: [
        'Real-time Speech Recognition & microphone dictation',
        'Auto-extracts Blood Pressure, Heart Rate, Temp °F & Resp Rate into chart fields',
        'Structured Subjective, Objective, Assessment, and Plan breakdown',
        'Full physician review and manual edit capability before chart persistence'
      ],
      previewType: 'soap'
    },
    registry: {
      title: 'Multi-Tenant Patient Registry',
      badge: 'Clinical Core',
      desc: 'High-performance demographic directory with multi-field search, gender filtering, age sorting, and chronic clinical history logs.',
      points: [
        'Instant search by patient full name or contact phone number',
        'Full demographic indexing (Age, Gender, Contact, Email)',
        'Chronic illness and drug allergy documentation',
        'Strict organization-level data isolation for clinic tenants'
      ],
      previewType: 'registry'
    },
    calendar: {
      title: 'Interactive Clinic Scheduling',
      badge: 'Operational Suite',
      desc: 'Full-month visual agenda matrix and slot booking system linked directly to clinicians and registered patient charts.',
      points: [
        'Month-by-month interactive calendar view with day slot density badges',
        'Daily agenda slot manager with real-time status transitions (Scheduled, Completed, Cancelled)',
        'Clinician assignment from active organization doctors',
        'Instant conflict prevention and patient chart linking'
      ],
      previewType: 'calendar'
    },
    vault: {
      title: 'Medical Scans & Document Vault',
      badge: 'Records Storage',
      desc: 'Secure digital repository for diagnostic imaging, prescriptions, laboratory reports, and clinical file attachments.',
      points: [
        'Supports Medical Documents, Lab Reports, Prescriptions, and Diagnostic Scans',
        'Role-restricted document upload and deletion for Doctors & Admins',
        'Detailed file metadata: file size formatting, uploader attribution, timestamps',
        'Direct inline preview and download capabilities'
      ],
      previewType: 'vault'
    },
    analytics: {
      title: 'Executive Analytics & PDF Reporting',
      badge: 'Clinical Intelligence',
      desc: 'Real-time statistical aggregation and client-side PDF document generation for clinic directors and health compliance.',
      points: [
        'Automated gender demographic distribution calculations',
        'Age bracket distribution analysis (0-18, 19-35, 36-50, 51-65, 65+)',
        'Historical visit trends and registration growth monitoring',
        'One-click client-side Executive PDF Report compilation with jsPDF'
      ],
      previewType: 'analytics'
    }
  };

  const handleCopyCredentials = (role) => {
    const creds = role === 'Admin' ? 'admin / admin123' : role === 'Doctor' ? 'doctor / doctor123' : 'receptionist / receptionist123';
    navigator.clipboard.writeText(creds);
    setCopiedDemo(role);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans antialiased overflow-x-hidden">
      
      {/* Background Grid Accent & Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.18),rgba(255,255,255,0))] z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                EHR Clinical Suite
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v2.0
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Electronic Health Records</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Clinical Modules</a>
            <a href="#showcase" className="hover:text-indigo-400 transition-colors">Live Showcase</a>
            <a href="#roles" className="hover:text-indigo-400 transition-colors">3-Tier RBAC</a>
            <a href="#security" className="hover:text-indigo-400 transition-colors">Architecture & Security</a>
            <a href="#demo" className="hover:text-indigo-400 transition-colors">Demo Credentials</a>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-150"
              >
                <span>Enter EHR Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all border border-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-150"
                >
                  <span>Launch Live Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-sm shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Powered by Gemini 2.5 Ambient Scribe & Multi-Tenant Mongoose</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Next-Generation <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-sky-400 bg-clip-text text-transparent">
              Electronic Health Records
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            A production-ready clinical operating system featuring AI voice dictation to SOAP charting, patient registry indexing, multi-doctor scheduling, and granular role-based security.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Access Clinical Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#showcase"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl text-sm border border-slate-800 transition-all"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Explore Interactive Modules</span>
            </a>
          </div>

          {/* Quick Real Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm text-center">
              <span className="text-2xl font-black text-white font-mono">100%</span>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Multi-Tenant Isolation</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm text-center">
              <span className="text-2xl font-black text-indigo-400 font-mono">3 Roles</span>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Admin • Doctor • Receptionist</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono">4 Vitals</span>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">BP, Temp, HR & Resp Rate</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm text-center">
              <span className="text-2xl font-black text-sky-400 font-mono">SOAP AI</span>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Gemini 2.5 Flash Scribe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Real Solution Section */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Clinical Workflow Engineered</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Built for High-Efficiency Modern Clinics</h3>
          <p className="text-slate-400 text-sm">Eliminate fragmented paperwork, chart backlog, and scheduling collisions with unified data integrity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/30 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Zero Note-Taking Fatigue</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Physicians spend up to 2 hours on documentation for every hour of care. Our Gemini Ambient Scribe captures raw voice dictation and formats structured SOAP assessments in seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/30 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Strict Boundary Defense</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-tier RBAC ensures Receptionists cannot view confidential clinical diagnostic notes, Doctors cannot register unauthorized staff accounts, and organization tenants cannot cross-read records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/30 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileSignature className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Instant Executive Reporting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compile full patient demographic distributions, age brackets, and chronological visit trends into formal downloadable PDF documents in a single click with built-in jsPDF rendering.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase & Real UI Walkthrough */}
      <section id="showcase" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Live Architecture Showcase</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Explore Real System Modules</h3>
          <p className="text-slate-400 text-sm">Select any module below to inspect its live technical specifications and UI design.</p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {Object.entries(featureShowcase).map(([key, feat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-transparent'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{feat.title.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Showcase Viewport */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Details & Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {featureShowcase[activeTab].badge}
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white">
                {featureShowcase[activeTab].title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {featureShowcase[activeTab].desc}
              </p>
            </div>

            <div className="space-y-2.5">
              {featureShowcase[activeTab].points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                <span>Launch in Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Module UI Mockup Representation */}
          <div className="lg:col-span-7 bg-[#0b111e] rounded-2xl border border-slate-800 p-5 shadow-inner space-y-4">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] text-slate-400 font-mono ml-2">ehr-app.internal/portal</span>
              </div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Live Module Preview
              </span>
            </div>

            {/* Content Mock per Tab */}
            {activeTab === 'scribe' && (
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Dictated Audio Stream
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono">Gemini 2.5 Active</span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic font-mono bg-slate-900/70 p-2 rounded border border-slate-800">
                    "Patient is 54yo male for BP check. Denies headache or chest pain. BP 138/88, pulse 76, temp 98.4 F, resp 16. Assessment: Primary hypertension. Plan: Increase Lisinopril to 20mg daily, recheck in 4 weeks."
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800"><span className="text-slate-400 block text-[9px]">BP</span><strong className="text-indigo-300">138/88</strong></div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800"><span className="text-slate-400 block text-[9px]">Temp</span><strong className="text-indigo-300">98.4°F</strong></div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800"><span className="text-slate-400 block text-[9px]">Pulse</span><strong className="text-indigo-300">76 bpm</strong></div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800"><span className="text-slate-400 block text-[9px]">Resp</span><strong className="text-indigo-300">16/min</strong></div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-[11px]">
                  <div><strong className="text-indigo-400">[S] Subjective:</strong> <span className="text-slate-300">Routine hypertension evaluation. Patient asymptomatic.</span></div>
                  <div><strong className="text-indigo-400">[O] Objective:</strong> <span className="text-slate-300">BP 138/88 mmHg. Clear breath sounds bilaterally.</span></div>
                  <div><strong className="text-indigo-400">[A] Assessment:</strong> <span className="text-slate-300 font-semibold">Primary essential hypertension (mild elevation).</span></div>
                  <div><strong className="text-indigo-400">[P] Plan:</strong> <span className="text-slate-300">Lisinopril 20mg PO daily. Routine labs. Follow-up 4 weeks.</span></div>
                </div>
              </div>
            )}

            {activeTab === 'registry' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2 p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>Search:</span> <strong className="text-white">"John Doe"</strong>
                  </div>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded">Filter: All Genders</span>
                </div>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                  <div className="p-2.5 flex items-center justify-between text-[11px]">
                    <div>
                      <h5 className="font-bold text-white">Johnathan Doe</h5>
                      <span className="text-[10px] text-slate-400">45 Yrs • Male • Phone: 555-0192</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 text-[10px] font-bold">Active Chart</span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between text-[11px]">
                    <div>
                      <h5 className="font-bold text-white">Sarah Jenkins</h5>
                      <span className="text-[10px] text-slate-400">32 Yrs • Female • Phone: 555-0144</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 text-[10px] font-bold">Active Chart</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                  <span className="font-bold text-white">Clinic Schedule • October 2026</span>
                  <span className="text-emerald-400 font-bold text-[10px]">● 4 Scheduled Today</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-bold">09:00 AM (Checkup)</div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300">10:30 AM (Follow-up)</div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300">01:00 PM (Consultation)</div>
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold">03:30 PM (Completed)</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold text-white"><span>Slot: 09:00 AM</span> <span className="text-indigo-400">Dr. Carter</span></div>
                  <p className="text-[10px] text-slate-400">Patient: Johnathan Doe • Reason: Routine Blood Pressure Review</p>
                </div>
              </div>
            )}

            {activeTab === 'vault' && (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <div>
                      <h6 className="font-bold text-white text-[11px]">Chest_XRay_PA_View.pdf</h6>
                      <span className="text-[9px] text-slate-400">Diagnostic Scan • 2.4 MB • Dr. Carter</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Encrypted</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <div>
                      <h6 className="font-bold text-white text-[11px]">Comprehensive_Metabolic_Panel.pdf</h6>
                      <span className="text-[9px] text-slate-400">Lab Report • 540 KB • Staff</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Encrypted</span>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800"><span className="text-slate-400">Registry Total</span><strong className="text-white block text-sm mt-0.5">148 Patients</strong></div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800"><span className="text-slate-400">Monthly Visits</span><strong className="text-emerald-400 block text-sm mt-0.5">312 Logs</strong></div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800"><span className="text-slate-400">Integrity Score</span><strong className="text-indigo-400 block text-sm mt-0.5">100%</strong></div>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-white block">Executive Health Summary</span>
                    <span className="text-[10px] text-slate-400">Compiled via jsPDF client vector engine</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold">
                    <Download className="w-3 h-3" /> Export PDF
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Role-Based Access Explorer */}
      <section id="roles" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Granular Authorization</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Three-Tier Role-Based Security Matrix</h3>
          <p className="text-slate-400 text-sm">See how permissions are segregated across clinical staff roles in real-time.</p>
        </div>

        {/* Role Selector Buttons */}
        <div className="flex justify-center gap-3 mb-8">
          {['Admin', 'Doctor', 'Receptionist'].map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeRole === role
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {role} Role View
            </button>
          ))}
        </div>

        {/* Role Matrix Card */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {activeRole} Permission Capabilities
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Role: {activeRole}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Receptionist' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/20 text-rose-400 opacity-60'}`}>
              {activeRole !== 'Receptionist' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Lock className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>Log Clinical SOAP Encounters</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Receptionist' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/20 text-rose-400 opacity-60'}`}>
              {activeRole !== 'Receptionist' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Lock className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>Delete Patient Clinical Records</span>
            </div>

            <div className="p-3 rounded-xl border bg-emerald-950/20 border-emerald-500/30 text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Register Patient Demographics</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Doctor' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              {activeRole !== 'Doctor' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />}
              <span>Create Clinic Appointments</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Receptionist' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/20 text-rose-400 opacity-60'}`}>
              {activeRole !== 'Receptionist' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Lock className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>Upload Scans & Lab Documents</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole === 'Admin' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/20 text-rose-400 opacity-60'}`}>
              {activeRole === 'Admin' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Lock className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>Register Clinical Staff Accounts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech & Security Trust Section */}
      <section id="security" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Technical Foundation</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Genuine Engineering Strengths</h3>
          <p className="text-slate-400 text-sm">Real technical mechanisms implemented across the backend and frontend codebases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-white">JWT & Role Middleware</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stateless JSON Web Tokens with bearer verification and mandatory role whitelists (`checkRole(['Admin', 'Doctor'])`) enforced on every endpoint.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-white">Multi-Tenant Isolation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every Patient, Encounter, and Appointment query strictly validates `req.user.organization._id` preventing cross-tenant leakage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-white">Helmet & Rate Limiting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express Helmet security headers plus IP-based window rate limiting protect against brute force and automated scraping vectors.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials & Fast Launch */}
      <section id="demo" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-[#0b111e] border border-indigo-500/30 text-center max-w-4xl mx-auto space-y-8 shadow-2xl">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Instant Sandbox Access</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Test All Three Clinical Roles</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Pre-seeded accounts are ready in the database. Click any role below to copy its credentials and log in instantly.
            </p>
          </div>

          {/* Role Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div 
              onClick={() => handleCopyCredentials('Admin')}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-indigo-300">Admin Role</span>
                <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 font-mono">
                  {copiedDemo === 'Admin' ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">User: <strong className="text-white">admin</strong></p>
              <p className="text-[11px] text-slate-400 font-mono">Pass: <strong className="text-white">admin123</strong></p>
            </div>

            <div 
              onClick={() => handleCopyCredentials('Doctor')}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-emerald-300">Doctor Role</span>
                <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 font-mono">
                  {copiedDemo === 'Doctor' ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">User: <strong className="text-white">doctor</strong></p>
              <p className="text-[11px] text-slate-400 font-mono">Pass: <strong className="text-white">doctor123</strong></p>
            </div>

            <div 
              onClick={() => handleCopyCredentials('Receptionist')}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-sky-300">Receptionist Role</span>
                <span className="text-[10px] text-slate-500 group-hover:text-sky-400 font-mono">
                  {copiedDemo === 'Receptionist' ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">User: <strong className="text-white">receptionist</strong></p>
              <p className="text-[11px] text-slate-400 font-mono">Pass: <strong className="text-white">receptionist123</strong></p>
            </div>
          </div>

          {/* Launch CTA */}
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
            >
              <span>Launch Live EHR Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-slate-800/80 bg-[#05080f] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">Electronic Health Record (EHR) System</span>
          </div>
          <p className="text-[11px]">
            Engineered with React 18, Tailwind CSS v4, Express, MongoDB & Google Gemini AI.
          </p>
        </div>
      </footer>

    </div>
  );
}
