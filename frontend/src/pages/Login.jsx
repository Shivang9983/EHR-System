import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Lock, User, ShieldAlert, ArrowRight, Loader2, ArrowLeft, Building2, HelpCircle, X, Check } from 'lucide-react';

export default function Login() {
  const { login, signup, user, error, setError } = useAuth();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [autofillRole, setAutofillRole] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleQuickFill = (u, p, role) => {
    setUsername(u);
    setPassword(p);
    setAutofillRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your staff username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (!isLoginTab && !orgName.trim()) {
      setError('Please enter your organization or clinic name.');
      return;
    }

    setLoading(true);

    try {
      const payload = isLoginTab
        ? await login(username.trim(), password)
        : await signup(username.trim(), password, orgName.trim());

      if (payload && payload.success) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Unable to reach the authentication server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between p-4 sm:p-6 antialiased selection:bg-[#E8E2D8] selection:text-[#1C1613]">
      
      {/* Top Header Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <Link 
          to="/"
          className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A6E] hover:text-[#1C1613] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </Link>
        <div className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider bg-white border border-[#E8E2D8] px-2.5 py-1 rounded-full shadow-2xs">
          Secure Portal 256-Bit
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto bg-white rounded-2xl shadow-sm border border-[#E8E2D8] overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#1C1613] text-[#FAF7F2] flex items-center justify-center shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-[#1C1613] tracking-tight">
            EHR Clinical Workspace
          </h1>
          <p className="text-xs text-[#8C7A6E]">
            {isLoginTab ? 'Sign in to access patient records and clinical logs' : 'Provision a new clinical organization workspace'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setError(''); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              isLoginTab ? 'bg-white text-[#1C1613] shadow-xs' : 'text-[#8C7A6E] hover:text-[#1C1613]'
            }`}
          >
            Staff Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setError(''); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              !isLoginTab ? 'bg-white text-[#1C1613] shadow-xs' : 'text-[#8C7A6E] hover:text-[#1C1613]'
            }`}
          >
            New Organization
          </button>
        </div>

        {/* Quick-Fill Sandbox Buttons (Login mode only) */}
        {isLoginTab && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider block">
              Quick-Fill Demo Role:
            </span>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123', 'Admin')}
                className={`py-1.5 px-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  autofillRole === 'Admin'
                    ? 'bg-[#1C1613] text-white border-[#1C1613]'
                    : 'bg-[#FAF7F2] text-[#4A372E] border-[#E8E2D8] hover:border-[#1C1613]'
                }`}
              >
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('doctor', 'doctor123', 'Doctor')}
                className={`py-1.5 px-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  autofillRole === 'Doctor'
                    ? 'bg-[#1C1613] text-white border-[#1C1613]'
                    : 'bg-[#FAF7F2] text-[#2D5A43] border-[#E8E2D8] hover:border-[#2D5A43]'
                }`}
              >
                <span>Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('receptionist', 'receptionist123', 'Receptionist')}
                className={`py-1.5 px-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  autofillRole === 'Receptionist'
                    ? 'bg-[#1C1613] text-white border-[#1C1613]'
                    : 'bg-[#FAF7F2] text-[#8C7A6E] border-[#E8E2D8] hover:border-[#8C7A6E]'
                }`}
              >
                <span>Receptionist</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 text-xs text-[#991B1B] border border-[#FEE2E2] rounded-xl bg-[#FDF2F2] font-medium shadow-2xs animate-in fade-in duration-150">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#991B1B] mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-['Inter',sans-serif]">
          <div>
            <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
              Username *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8C7A6E]">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => { setUsername(e.target.value); setAutofillRole(null); }}
                placeholder="Enter clinical username"
                className="w-full pl-9"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Password *
              </label>
              {isLoginTab && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] text-[#8C7A6E] hover:text-[#1C1613] font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8C7A6E]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAutofillRole(null); }}
                placeholder="Enter password"
                className="w-full pl-9"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Organization Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8C7A6E]">
                  <Building2 className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Metro Health Partners"
                  className="w-full pl-9"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl shadow-sm transition-all text-xs focus:outline-none disabled:opacity-50 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{isLoginTab ? 'Sign In to Workspace' : 'Create Organization Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E8E2D8] text-[11px] text-[#8C7A6E]">
          Protected by JWT encryption and role-level tenant isolation.
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E8E2D8] p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div className="flex items-center gap-2 text-[#1C1613] font-bold text-xs">
                <HelpCircle className="w-4 h-4" />
                <span>Password Reset Instructions</span>
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="text-[#8C7A6E] hover:text-[#1C1613] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              For HIPAA audit safety, passwords for staff members are managed directly by your organization's <strong className="text-[#1C1613]">Admin</strong> in <strong>Portal Settings → Staff Administration</strong>.
            </p>
            <p className="text-xs text-[#8C7A6E] leading-relaxed font-['Inter',sans-serif]">
              If you are testing the live sandbox, use the pre-seeded demo accounts: <code className="text-[#1C1613] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8E2D8]">admin / admin123</code>.
            </p>

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[10px] text-[#8C7A6E] py-2">
        © EHR Clinical Suite. All rights reserved.
      </footer>
    </div>
  );
}
