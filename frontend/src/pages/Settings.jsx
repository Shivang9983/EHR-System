import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Users, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

export default function Settings() {
  const { user, token, authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Security Tab state
  const [secData, setSecData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [secLoading, setSecLoading] = useState(false);
  
  // User Management Tab state
  const [staffData, setStaffData] = useState({ username: '', password: '', role: 'Doctor' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
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
    
    setSecLoading(true);
    try {
      const response = await authFetch('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          oldPassword: secData.oldPassword,
          newPassword: secData.newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Security credentials updated successfully.');
        setSecData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrorMsg(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to authentication server.');
    } finally {
      setSecLoading(false);
    }
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div>
        <h1 className="text-lg font-bold text-[#1C1613] tracking-tight">Portal & Account Settings</h1>
        <p className="text-xs text-[#8C7A6E]">Configure staff profile, security credentials, and role administration</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8E2D8] gap-1">
        <button
          onClick={() => { setActiveTab('profile'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'border-[#1C1613] text-[#1C1613]' : 'border-transparent text-[#8C7A6E] hover:text-[#1C1613]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Staff Profile</span>
        </button>
        <button
          onClick={() => { setActiveTab('security'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'security' ? 'border-[#1C1613] text-[#1C1613]' : 'border-transparent text-[#8C7A6E] hover:text-[#1C1613]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
        {user?.role === 'Admin' && (
          <button
            onClick={() => { setActiveTab('staff'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'staff' ? 'border-[#1C1613] text-[#1C1613]' : 'border-transparent text-[#8C7A6E] hover:text-[#1C1613]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Administration</span>
          </button>
        )}
      </div>

      {(errorMsg || successMsg) && (
        <div className="max-w-xl font-['Inter',sans-serif]">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 text-xs text-[#991B1B] border border-[#FEE2E2] rounded-xl bg-[#FDF2F2] font-medium shadow-2xs">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#991B1B] mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 text-xs text-[#2D5A43] border border-[#D5E5D9] rounded-xl bg-[#EAF2ED] font-medium shadow-2xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D5A43] mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-2xs max-w-xl overflow-hidden p-6 font-['Inter',sans-serif]">
        
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">Your Profile Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl">
                <span className="text-[#8C7A6E] block mb-1 text-[10px] font-bold uppercase tracking-wider">Staff Username</span>
                <span className="font-bold text-[#1C1613] font-mono">{user?.username}</span>
              </div>
              <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl">
                <span className="text-[#8C7A6E] block mb-1 text-[10px] font-bold uppercase tracking-wider">Assigned Role</span>
                <span className="font-bold text-[#2D5A43] uppercase text-[11px]">{user?.role}</span>
              </div>
              <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl col-span-2">
                <span className="text-[#8C7A6E] block mb-1 text-[10px] font-bold uppercase tracking-wider">Healthcare Organization</span>
                <span className="font-bold text-[#4A372E]">{user?.organizationName || user?.organization?.name || 'Default Health Clinic'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h2 className="text-sm font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">Change Password</h2>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Current Password</label>
              <input
                type="password"
                required
                value={secData.oldPassword}
                onChange={(e) => setSecData(prev => ({ ...prev, oldPassword: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                value={secData.newPassword}
                onChange={(e) => setSecData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Confirm New Password</label>
              <input
                type="password"
                required
                value={secData.confirmPassword}
                onChange={(e) => setSecData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={secLoading}
              className="px-4 py-2.5 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl text-xs cursor-pointer transition-all disabled:opacity-50 shadow-3xs flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif]"
            >
              {secLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <span>Update Credentials</span>
              )}
            </button>
          </form>
        )}

        {activeTab === 'staff' && (
          <form onSubmit={handleRegisterStaff} className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">Register Clinic Staff</h2>
              <p className="text-xs text-[#8C7A6E] mt-0.5">Provision clinical credentials for incoming Doctors or Receptionists</p>
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Staff Username *</label>
              <input
                type="text"
                required
                placeholder="e.g. dr_miller"
                value={staffData.username}
                onChange={(e) => setStaffData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Temporary Password (min 8 chars) *</label>
              <input
                type="password"
                required
                placeholder="Enter temporary password"
                value={staffData.password}
                onChange={(e) => setStaffData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Clinical Role *</label>
              <select
                value={staffData.role}
                onChange={(e) => setStaffData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full"
              >
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl text-xs cursor-pointer transition-all disabled:opacity-50 shadow-3xs flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering Staff...</span>
                </>
              ) : (
                <span>Register Staff Account</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
