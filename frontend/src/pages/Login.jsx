import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Lock, User, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, signup, user, error, setError } = useAuth();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password) {
      setError('Please provide staff credentials.');
      setLoading(false);
      return;
    }

    const payload = isLoginTab
      ? await login(username.trim(), password)
      : await signup(username.trim(), password, orgName);

    if (payload.success) {
      navigate('/dashboard');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-650 mb-3 shadow-inner">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            EHR Clinical Portal
          </h1>
          <p className="text-[11px] text-slate-450 mt-1">
            Access secure health records & clinical workspaces
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 text-xs text-rose-600 border border-rose-100 rounded-lg bg-rose-50/70">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="leading-normal font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter staff username"
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Organization Name
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Green Valley Clinic"
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : isLoginTab ? 'Sign In to Portal' : 'Register Organization'}</span>
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setIsLoginTab(!isLoginTab);
              setError('');
            }}
            className="text-xs text-indigo-650 hover:text-indigo-850 font-semibold hover:underline focus:outline-none cursor-pointer"
          >
            {isLoginTab
              ? 'Register a new SaaS organization'
              : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
