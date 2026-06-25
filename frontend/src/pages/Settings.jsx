import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Users, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Security Tab state
  const [secData, setSecData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  
  // User Management Tab state
  const [staffData, setStaffData] = useState({ username: '', password: '', role: 'Doctor' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (secData.newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (secData.newPassword !== secData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }
    // Simulate API update
    setSuccessMsg('Security credentials updated successfully.');
    setSecData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    
    if (staffData.username.length < 4) {
      setErrorMsg('Username must be at least 4 characters.');
      setLoading(false);
      return;
    }
    if (staffData.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: staffData.username.trim(),
          password: staffData.password,
          role: staffData.role
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`Staff member ${data.username} registered successfully as ${data.role}!`);
        setStaffData({ username: '', password: '', role: 'Doctor' });
      } else {
        setErrorMsg(data.message || 'Staff registration failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Account & Portal Settings</h1>
        <p className="text-xs text-slate-500">Configure clinic profile, security policies, and manage clinical staff</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('profile'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Staff Profile</span>
        </button>
        <button
          onClick={() => { setActiveTab('security'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>
        {user?.role === 'Doctor' && (
          <button
            onClick={() => { setActiveTab('staff'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'staff' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Administration</span>
          </button>
        )}
      </div>

      {(errorMsg || successMsg) && (
        <div className="max-w-md">
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 text-xs text-rose-600 border border-rose-100 rounded-lg bg-rose-50">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-505" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2 p-3 text-xs text-emerald-600 border border-emerald-100 rounded-lg bg-emerald-50">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-505" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs max-w-xl overflow-hidden p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-850">Your Profile Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block mb-0.5">Staff Username</span>
                <span className="font-bold text-slate-700">{user?.username}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block mb-0.5">Assigned Role</span>
                <span className="font-bold text-slate-700">{user?.role}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg col-span-2">
                <span className="text-slate-400 block mb-0.5">Portal Status</span>
                <span className="font-semibold text-slate-750 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active session
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-850">Change Password</h2>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Current Password</label>
              <input
                type="password"
                required
                value={secData.oldPassword}
                onChange={(e) => setSecData(prev => ({ ...prev, oldPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                value={secData.newPassword}
                onChange={(e) => setSecData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Confirm New Password</label>
              <input
                type="password"
                required
                value={secData.confirmPassword}
                onChange={(e) => setSecData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors"
            >
              Update Credentials
            </button>
          </form>
        )}

        {activeTab === 'staff' && (
          <form onSubmit={handleRegisterStaff} className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-850">Register Clinic Staff</h2>
              <p className="text-[11px] text-slate-450 mt-0.5">Create clinical accounts for new doctors or receptionists</p>
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Staff Username *</label>
              <input
                type="text"
                required
                placeholder="e.g. carter_md"
                value={staffData.username}
                onChange={(e) => setStaffData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Temporary Password (min 8 chars) *</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={staffData.password}
                onChange={(e) => setStaffData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Clinical Role *</label>
              <select
                value={staffData.role}
                onChange={(e) => setStaffData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
              >
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Staff Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
