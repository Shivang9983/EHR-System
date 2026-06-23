import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Lock, User, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login, signup, user, error, setError } = useAuth();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Doctor');
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

    if (!username || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const payload = isLoginTab
      ? await login(username, password)
      : await signup(username, password, role);

    if (payload.success) {
      navigate('/dashboard');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            EHR Clinical Portal
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access secure health records
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="flex items-start gap-2.5 p-3 mb-6 text-xs text-rose-600 border border-rose-100 rounded-lg bg-rose-50">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
                />
              </div>
            </div>

            {!isLoginTab && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Clinical Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Doctor')}
                    className={`py-2 px-4 rounded-lg font-medium text-xs border transition-all cursor-pointer ${
                      role === 'Doctor'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Receptionist')}
                    className={`py-2 px-4 rounded-lg font-medium text-xs border transition-all cursor-pointer ${
                      role === 'Receptionist'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Receptionist
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-sm focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : isLoginTab ? 'Sign In' : 'Create Staff Profile'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginTab(!isLoginTab);
                setError('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline focus:outline-none cursor-pointer"
            >
              {isLoginTab
                ? 'Register a new clinical staff account'
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
