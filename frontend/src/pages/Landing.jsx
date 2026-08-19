import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Database, 
  Shield, 
  Download, 
  Mic, 
  Eye, 
  Check
} from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('scribe');
  const [activeRole, setActiveRole] = useState('Doctor');
  const [copiedDemo, setCopiedDemo] = useState(false);

  const featureShowcase = {
    scribe: {
      title: 'AI Ambient Clinical Scribe (Gemini 2.5)',
      badge: 'Modern Clinical AI',
      desc: 'Dictate natural doctor-patient consultations or upload audio notes. The system converts raw dictation into audit-ready SOAP notes with automated vital extraction.',
      points: [
        'Real-time Speech Recognition microphone dictation',
        'Auto-extracts Blood Pressure, Heart Rate, Temp °F & Resp Rate into chart fields',
        'Structured Subjective, Objective, Assessment, and Plan breakdown',
        'Full clinician review and manual editing before chart submission'
      ],
    },
    registry: {
      title: 'Multi-Tenant Patient Registry',
      badge: 'Demographic Indexing',
      desc: 'High-performance demographic directory with multi-field search, gender filtering, age sorting, and chronic clinical history logs.',
      points: [
        'Instant multi-field search by patient name or contact phone',
        'Comprehensive demographic records (Age, Gender, Contact, Email)',
        'Chronic illness declaration and drug allergy tracking',
        'Strict organization-level data boundaries between clinic accounts'
      ],
    },
    calendar: {
      title: 'Interactive Clinic Scheduling',
      badge: 'Practice Operations',
      desc: 'Visual monthly agenda matrix and slot booking system linked directly to clinicians and registered patient charts.',
      points: [
        'Month-by-month interactive calendar view with daily appointment density',
        'Daily agenda slot manager with real-time lifecycle tracking (Scheduled, Completed, Cancelled)',
        'Direct doctor assignment from active organization clinicians',
        'Conflict prevention and one-click patient chart linking'
      ],
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
    },
    analytics: {
      title: 'Executive Analytics & PDF Reporting',
      badge: 'Practice Insights',
      desc: 'Real-time statistical aggregation and client-side PDF document generation for clinic directors and health compliance.',
      points: [
        'Automated gender demographic distribution calculations',
        'Age bracket distribution analysis (0-18, 19-35, 36-50, 51-65, 65+)',
        'Historical visit trends and registration growth monitoring',
        'One-click client-side Executive PDF Report compilation with jsPDF'
      ],
    }
  };

  const handleCopyCredentials = (role) => {
    const creds = role === 'Admin' ? 'admin / admin123' : role === 'Doctor' ? 'doctor / doctor123' : 'receptionist / receptionist123';
    navigator.clipboard.writeText(creds);
    setCopiedDemo(role);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#E8E2D8] selection:text-[#1C1613]">
      
      {/* Top Bar / Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#1C1613] text-[#FAF7F2] flex items-center justify-center shadow-sm group-hover:bg-[#4A372E] transition-colors">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-[#1C1613] flex items-center gap-2">
                EHR Clinical Suite
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF2ED] text-[#2D5A43] border border-[#D5E5D9]">
                  v2.0 Active
                </span>
              </span>
              <p className="text-[10px] text-[#8C7A6E] font-medium">Enterprise Practice Operating System</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#8C7A6E]">
            <a href="#features" className="hover:text-[#1C1613] transition-colors">Clinical Core</a>
            <a href="#showcase" className="hover:text-[#1C1613] transition-colors">Interactive Modules</a>
            <a href="#roles" className="hover:text-[#1C1613] transition-colors">Role Matrix</a>
            <a href="#security" className="hover:text-[#1C1613] transition-colors">Architecture</a>
            <a href="#demo" className="hover:text-[#1C1613] transition-colors">Sandbox Access</a>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <span>Enter EHR Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-[#4A372E] hover:text-[#1C1613] hover:bg-white rounded-xl transition-all border border-[#E8E2D8]"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
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
      <section className="pt-20 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D8] text-[#4A372E] text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>Gemini 2.5 Ambient Scribe & Multi-Tenant Mongoose Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1613] tracking-tight leading-[1.12]">
            The Human-Centered <br className="hidden sm:inline" />
            <span className="text-[#4A372E] underline decoration-[#E8E2D8] decoration-2 underline-offset-8">
              Clinical Operating System
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8C7A6E] leading-relaxed max-w-2xl mx-auto font-normal">
            An intentional Electronic Health Record suite designed for modern medical practices. Features AI voice dictation to SOAP notes, comprehensive patient registries, multi-doctor scheduling, and strict 3-tier RBAC.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl text-xs shadow-md hover:scale-[1.01] transition-all"
            >
              <span>Access Clinical Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#showcase"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#F3EFE9] text-[#1C1613] font-semibold rounded-xl text-xs border border-[#E8E2D8] transition-all shadow-2xs"
            >
              <Eye className="w-4 h-4 text-[#8C7A6E]" />
              <span>Explore Interactive Modules</span>
            </a>
          </div>

          {/* Core Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-[#E8E2D8]">
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] text-center shadow-3xs">
              <span className="text-2xl font-black text-[#1C1613] font-mono">100%</span>
              <p className="text-[11px] text-[#8C7A6E] uppercase tracking-wider font-bold mt-1">Tenant Boundary Isolation</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] text-center shadow-3xs">
              <span className="text-2xl font-black text-[#4A372E] font-mono">3 Roles</span>
              <p className="text-[11px] text-[#8C7A6E] uppercase tracking-wider font-bold mt-1">Admin • Doctor • Receptionist</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] text-center shadow-3xs">
              <span className="text-2xl font-black text-[#2D5A43] font-mono">4 Vitals</span>
              <p className="text-[11px] text-[#8C7A6E] uppercase tracking-wider font-bold mt-1">BP, Temp, HR & Resp Rate</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] text-center shadow-3xs">
              <span className="text-2xl font-black text-[#1C1613] font-mono">SOAP AI</span>
              <p className="text-[11px] text-[#8C7A6E] uppercase tracking-wider font-bold mt-1">Gemini 2.5 Flash Scribe</p>
            </div>
          </div>

        </div>
      </section>

      {/* Problem & Clinical Value Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E8E2D8]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8C7A6E]">Clinical Workflow Engineered</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1613]">Designed for Thoughtful Clinical Care</h3>
          <p className="text-[#8C7A6E] text-xs sm:text-sm">Eliminating fragmented paper charts, administrative burnout, and scheduling bottlenecks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-4 shadow-3xs hover:border-[#8C7A6E]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#4A372E] flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#1C1613]">Zero Documentation Burnout</h4>
            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              Physicians spend hours typing daily notes. Our Gemini Ambient Scribe captures clinical speech and formats structured SOAP assessments and vitals automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-4 shadow-3xs hover:border-[#8C7A6E]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#2D5A43] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#1C1613]">Strict Role Separation</h4>
            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              Granular RBAC ensures Receptionists manage appointments without viewing confidential diagnostic notes, and Doctors cannot register unvetted staff accounts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-4 shadow-3xs hover:border-[#8C7A6E]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1613] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#1C1613]">Instant Clinical PDF Reports</h4>
            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              Compile demographic distributions, age brackets, and visit trend metrics into formal executive PDF documents with one click via client-side jsPDF rendering.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase & UI Walkthrough */}
      <section id="showcase" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E8E2D8]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8C7A6E]">Live Product Showcase</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1613]">Explore Real Core Modules</h3>
          <p className="text-[#8C7A6E] text-xs sm:text-sm">Click through the modules below to inspect how clinical workflows are structured.</p>
        </div>

        {/* Feature Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {Object.entries(featureShowcase).map(([key, feat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === key
                  ? 'bg-[#1C1613] text-white shadow-xs'
                  : 'bg-white text-[#8C7A6E] hover:text-[#1C1613] border border-[#E8E2D8]'
              }`}
            >
              <span>{feat.title.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Showcase Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Details & Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#4A372E] border border-[#E8E2D8]">
                {featureShowcase[activeTab].badge}
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#1C1613]">
                {featureShowcase[activeTab].title}
              </h4>
              <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
                {featureShowcase[activeTab].desc}
              </p>
            </div>

            <div className="space-y-2.5">
              {featureShowcase[activeTab].points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4A372E] font-['Inter',sans-serif]">
                  <div className="w-4 h-4 rounded-full bg-[#EAF2ED] text-[#2D5A43] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E2D8]">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white text-xs font-bold rounded-lg shadow-xs transition-all"
              >
                <span>Launch in Live Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Module UI Mockup */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D8] p-5 shadow-inner space-y-4">
            
            {/* Mock Window Bar */}
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8E2D8]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8E2D8]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8E2D8]" />
                <span className="text-[10px] text-[#8C7A6E] font-mono ml-2">ehr.practice.internal/workspace</span>
              </div>
              <span className="text-[9px] text-[#2D5A43] font-bold uppercase tracking-wider bg-[#EAF2ED] px-2 py-0.5 rounded border border-[#D5E5D9]">
                Live Architecture
              </span>
            </div>

            {/* Dynamic Content */}
            {activeTab === 'scribe' && (
              <div className="space-y-3 text-xs font-['Inter',sans-serif]">
                <div className="p-3 bg-white border border-[#E8E2D8] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#4A372E] uppercase flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
                      <Sparkles className="w-3.5 h-3.5 text-[#2D5A43]" /> Dictated Audio Stream
                    </span>
                    <span className="text-[9px] text-[#2D5A43] font-mono font-bold">Gemini 2.5 Flash</span>
                  </div>
                  <p className="text-[11px] text-[#4A372E] italic font-mono bg-[#FAF7F2] p-2.5 rounded border border-[#E8E2D8]">
                    "Patient is 54yo male for BP check. Denies headache or chest pain. BP 138/88, pulse 76, temp 98.4 F, resp 16. Assessment: Primary hypertension. Plan: Increase Lisinopril to 20mg daily, recheck in 4 weeks."
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded-lg bg-white border border-[#E8E2D8]"><span className="text-[#8C7A6E] block text-[9px]">BP</span><strong className="text-[#1C1613]">138/88</strong></div>
                  <div className="p-2 rounded-lg bg-white border border-[#E8E2D8]"><span className="text-[#8C7A6E] block text-[9px]">Temp</span><strong className="text-[#1C1613]">98.4°F</strong></div>
                  <div className="p-2 rounded-lg bg-white border border-[#E8E2D8]"><span className="text-[#8C7A6E] block text-[9px]">Pulse</span><strong className="text-[#1C1613]">76 bpm</strong></div>
                  <div className="p-2 rounded-lg bg-white border border-[#E8E2D8]"><span className="text-[#8C7A6E] block text-[9px]">Resp</span><strong className="text-[#1C1613]">16/min</strong></div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E8E2D8] space-y-2 text-[11px]">
                  <div><strong className="text-[#4A372E]">[S] Subjective:</strong> <span className="text-[#1C1613]">Routine hypertension evaluation. Patient asymptomatic.</span></div>
                  <div><strong className="text-[#4A372E]">[O] Objective:</strong> <span className="text-[#1C1613]">BP 138/88 mmHg. Clear breath sounds bilaterally.</span></div>
                  <div><strong className="text-[#4A372E]">[A] Assessment:</strong> <span className="text-[#1C1613] font-semibold">Primary essential hypertension (mild elevation).</span></div>
                  <div><strong className="text-[#4A372E]">[P] Plan:</strong> <span className="text-[#1C1613]">Lisinopril 20mg PO daily. Routine metabolic panel. Follow-up 4 weeks.</span></div>
                </div>
              </div>
            )}

            {activeTab === 'registry' && (
              <div className="space-y-3 text-xs font-['Inter',sans-serif]">
                <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-[#E8E2D8]">
                  <div className="text-[11px] text-[#8C7A6E]">
                    <span>Search Filter:</span> <strong className="text-[#1C1613]">"Johnathan Doe"</strong>
                  </div>
                  <span className="text-[9px] text-[#4A372E] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E2D8] font-bold">All Genders</span>
                </div>

                <div className="divide-y divide-[#E8E2D8] border border-[#E8E2D8] rounded-xl overflow-hidden bg-white">
                  <div className="p-3 flex items-center justify-between text-[11px]">
                    <div>
                      <h5 className="font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">Johnathan Doe</h5>
                      <span className="text-[10px] text-[#8C7A6E]">45 Yrs • Male • Phone: 555-0192 • Allergy: Penicillin</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF2ED] text-[#2D5A43] text-[9px] font-bold uppercase border border-[#D5E5D9]">Chart Active</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-[11px]">
                    <div>
                      <h5 className="font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">Sarah Jenkins</h5>
                      <span className="text-[10px] text-[#8C7A6E]">32 Yrs • Female • Phone: 555-0144 • Allergy: None</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF2ED] text-[#2D5A43] text-[9px] font-bold uppercase border border-[#D5E5D9]">Chart Active</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-3 text-xs font-['Inter',sans-serif]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8] text-[11px]">
                  <span className="font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">Clinic Schedule Matrix</span>
                  <span className="text-[#2D5A43] font-bold text-[10px]">● 4 Consultations Scheduled</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-white border border-[#4A372E] text-[#4A372E] font-bold">09:00 AM (Checkup)</div>
                  <div className="p-2 rounded-lg bg-white border border-[#E8E2D8] text-[#1C1613]">10:30 AM (Follow-up)</div>
                  <div className="p-2 rounded-lg bg-white border border-[#E8E2D8] text-[#1C1613]">01:00 PM (Consultation)</div>
                  <div className="p-2 rounded-lg bg-[#EAF2ED] border border-[#D5E5D9] text-[#2D5A43] font-bold">03:30 PM (Completed)</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E8E2D8] space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold text-[#1C1613]"><span>Slot: 09:00 AM</span> <span className="text-[#4A372E]">Dr. Carter</span></div>
                  <p className="text-[10px] text-[#8C7A6E]">Patient: Johnathan Doe • Reason: Hypertension Routine Review</p>
                </div>
              </div>
            )}

            {activeTab === 'vault' && (
              <div className="space-y-2 text-xs font-['Inter',sans-serif]">
                <div className="p-3 rounded-lg bg-white border border-[#E8E2D8] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#4A372E]" />
                    <div>
                      <h6 className="font-bold text-[#1C1613] text-[11px]">Chest_XRay_PA_View.pdf</h6>
                      <span className="text-[9px] text-[#8C7A6E]">Diagnostic Scan • 2.4 MB • Dr. Carter</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#2D5A43] font-bold uppercase bg-[#EAF2ED] px-2 py-0.5 rounded border border-[#D5E5D9]">Encrypted</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E8E2D8] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#2D5A43]" />
                    <div>
                      <h6 className="font-bold text-[#1C1613] text-[11px]">Comprehensive_Metabolic_Panel.pdf</h6>
                      <span className="text-[9px] text-[#8C7A6E]">Lab Report • 540 KB • Staff</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#2D5A43] font-bold uppercase bg-[#EAF2ED] px-2 py-0.5 rounded border border-[#D5E5D9]">Encrypted</span>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-3 text-xs font-['Inter',sans-serif]">
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E8E2D8]"><span className="text-[#8C7A6E]">Registry Total</span><strong className="text-[#1C1613] block text-sm mt-0.5 font-mono font-bold">148</strong></div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E8E2D8]"><span className="text-[#8C7A6E]">Monthly Visits</span><strong className="text-[#2D5A43] block text-sm mt-0.5 font-mono font-bold">312</strong></div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E8E2D8]"><span className="text-[#8C7A6E]">Integrity Score</span><strong className="text-[#1C1613] block text-sm mt-0.5 font-mono font-bold">100%</strong></div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E8E2D8] flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-[#1C1613] block">Executive Health Summary</span>
                    <span className="text-[10px] text-[#8C7A6E]">Demographic & encounter statistical report</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1 bg-[#1C1613] text-white rounded-lg text-[10px] font-bold">
                    <Download className="w-3 h-3" /> Export PDF
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Role-Based Access Matrix */}
      <section id="roles" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E8E2D8]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8C7A6E]">Granular Authorization</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1613]">Three-Tier Role-Based Security Matrix</h3>
          <p className="text-[#8C7A6E] text-xs sm:text-sm">Enforced strictly at the API layer and reflected throughout UI interactions.</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {['Admin', 'Doctor', 'Receptionist'].map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeRole === role
                  ? 'bg-[#1C1613] text-white shadow-xs'
                  : 'bg-white text-[#8C7A6E] hover:text-[#1C1613] border border-[#E8E2D8]'
              }`}
            >
              {role} View
            </button>
          ))}
        </div>

        {/* Permissions Grid */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
            <span className="text-xs font-bold text-[#1C1613] uppercase tracking-wider">
              {activeRole} Permission Scope
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FAF7F2] text-[#4A372E] border border-[#E8E2D8]">
              Role: {activeRole}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-['Inter',sans-serif]">
            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Receptionist' ? 'bg-[#EAF2ED] border-[#D5E5D9] text-[#2D5A43]' : 'bg-[#FAF7F2] border-[#E8E2D8] text-[#8C7A6E] opacity-60'}`}>
              {activeRole !== 'Receptionist' ? <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" /> : <Lock className="w-4 h-4 text-[#8C7A6E] shrink-0" />}
              <span>Log Clinical SOAP Encounters</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Receptionist' ? 'bg-[#EAF2ED] border-[#D5E5D9] text-[#2D5A43]' : 'bg-[#FAF7F2] border-[#E8E2D8] text-[#8C7A6E] opacity-60'}`}>
              {activeRole !== 'Receptionist' ? <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" /> : <Lock className="w-4 h-4 text-[#8C7A6E] shrink-0" />}
              <span>Delete Patient Clinical Records</span>
            </div>

            <div className="p-3 rounded-xl border bg-[#EAF2ED] border-[#D5E5D9] text-[#2D5A43] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" />
              <span>Register Patient Demographics</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Doctor' ? 'bg-[#EAF2ED] border-[#D5E5D9] text-[#2D5A43]' : 'bg-[#FAF7F2] border-[#E8E2D8] text-[#8C7A6E]'}`}>
              <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" />
              <span>Create Clinic Appointments</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole !== 'Receptionist' ? 'bg-[#EAF2ED] border-[#D5E5D9] text-[#2D5A43]' : 'bg-[#FAF7F2] border-[#E8E2D8] text-[#8C7A6E] opacity-60'}`}>
              {activeRole !== 'Receptionist' ? <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" /> : <Lock className="w-4 h-4 text-[#8C7A6E] shrink-0" />}
              <span>Upload Scans & Lab Documents</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${activeRole === 'Admin' ? 'bg-[#EAF2ED] border-[#D5E5D9] text-[#2D5A43]' : 'bg-[#FAF7F2] border-[#E8E2D8] text-[#8C7A6E] opacity-60'}`}>
              {activeRole === 'Admin' ? <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" /> : <Lock className="w-4 h-4 text-[#8C7A6E] shrink-0" />}
              <span>Register Clinical Staff Accounts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section id="security" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E8E2D8]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8C7A6E]">Technical Foundation</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1613]">Verified Engineering Architecture</h3>
          <p className="text-[#8C7A6E] text-xs sm:text-sm">Real technical controls implemented across backend routes and client components.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-3 shadow-3xs">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#1C1613] border border-[#E8E2D8] flex items-center justify-center">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-[#1C1613]">JWT & Role Middleware</h4>
            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              Stateless JSON Web Tokens with bearer verification and mandatory role whitelists (`checkRole(['Admin', 'Doctor'])`) enforced on every endpoint.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-3 shadow-3xs">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#2D5A43] border border-[#E8E2D8] flex items-center justify-center">
              <Database className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-[#1C1613]">Multi-Tenant Isolation</h4>
            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              Every Patient, Encounter, and Appointment query strictly validates `req.user.organization._id` preventing cross-tenant leakage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] space-y-3 shadow-3xs">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#4A372E] border border-[#E8E2D8] flex items-center justify-center">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-sm font-bold text-[#1C1613]">Helmet & Rate Limiting</h4>
            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              Express Helmet security headers plus IP-based window rate limiting protect against brute force and automated scraping vectors.
            </p>
          </div>
        </div>
      </section>

      {/* Sandbox Demo Credentials */}
      <section id="demo" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E8E2D8]">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8E2D8] text-center max-w-4xl mx-auto space-y-8 shadow-sm">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7A6E]">Instant Sandbox Access</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1C1613]">Test Pre-Seeded Roles</h3>
            <p className="text-[#8C7A6E] text-xs sm:text-sm max-w-xl mx-auto font-['Inter',sans-serif]">
              Click any role card below to copy its credentials and sign in immediately to explore the live application.
            </p>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div 
              onClick={() => handleCopyCredentials('Admin')}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#1C1613] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[#1C1613]">Admin Role</span>
                <span className="text-[10px] text-[#8C7A6E] group-hover:text-[#1C1613] font-mono">
                  {copiedDemo === 'Admin' ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
              <p className="text-[11px] text-[#8C7A6E] font-mono">User: <strong className="text-[#1C1613]">admin</strong></p>
              <p className="text-[11px] text-[#8C7A6E] font-mono">Pass: <strong className="text-[#1C1613]">admin123</strong></p>
            </div>

            <div 
              onClick={() => handleCopyCredentials('Doctor')}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#1C1613] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[#2D5A43]">Doctor Role</span>
                <span className="text-[10px] text-[#8C7A6E] group-hover:text-[#2D5A43] font-mono">
                  {copiedDemo === 'Doctor' ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
              <p className="text-[11px] text-[#8C7A6E] font-mono">User: <strong className="text-[#1C1613]">doctor</strong></p>
              <p className="text-[11px] text-[#8C7A6E] font-mono">Pass: <strong className="text-[#1C1613]">doctor123</strong></p>
            </div>

            <div 
              onClick={() => handleCopyCredentials('Receptionist')}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#1C1613] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[#4A372E]">Receptionist Role</span>
                <span className="text-[10px] text-[#8C7A6E] group-hover:text-[#4A372E] font-mono">
                  {copiedDemo === 'Receptionist' ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
              <p className="text-[11px] text-[#8C7A6E] font-mono">User: <strong className="text-[#1C1613]">receptionist</strong></p>
              <p className="text-[11px] text-[#8C7A6E] font-mono">Pass: <strong className="text-[#1C1613]">receptionist123</strong></p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#1C1613] hover:bg-[#4A372E] text-white font-extrabold rounded-xl text-xs shadow-md hover:scale-[1.01] transition-all"
            >
              <span>Launch Live EHR Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#E8E2D8] bg-[#FAF7F2] text-xs text-[#8C7A6E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#1C1613] text-white flex items-center justify-center font-bold text-xs">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#1C1613]">Electronic Health Record (EHR) System</span>
          </div>
          <p className="text-[11px]">
            Engineered with React 18, Vite, Express, MongoDB & Google Gemini AI.
          </p>
        </div>
      </footer>

    </div>
  );
}
