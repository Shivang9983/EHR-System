import React, { useState } from 'react';
import { Heart, Edit2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PatientDemographicCard({ patient, onUpdateSuccess }) {
  const { authFetch } = useAuth();
  const [editing, setEditing] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  const handleSaveHistory = async () => {
    setSaving(true);
    setMsg({ error: '', success: '' });
    try {
      const res = await authFetch(`/api/patients/${patient._id}`, {
        method: 'PUT',
        body: JSON.stringify({ medicalHistory: medicalHistory.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ error: '', success: 'Medical history updated.' });
        setEditing(false);
        onUpdateSuccess(data.patient);
      } else {
        setMsg({ error: data.message || 'Failed to update chart.', success: '' });
      }
    } catch (err) {
      setMsg({ error: 'Connection failed.', success: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs space-y-6 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Patient Avatar & Name */}
      <div className="flex items-center gap-3.5 border-b border-[#E8E2D8] pb-5">
        <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1613] flex items-center justify-center font-bold text-base uppercase shrink-0 shadow-3xs font-mono">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-[#1C1613] truncate">
            {patient.firstName} {patient.lastName}
          </h2>
          <span className="text-[9px] text-[#2D5A43] bg-[#EAF2ED] border border-[#D5E5D9] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider mt-1.5 inline-block">
            Chart Active
          </span>
        </div>
      </div>

      {/* Demographics details */}
      <div className="space-y-3.5 font-['Inter',sans-serif]">
        <h3 className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Patient Profile</h3>
        <div className="flex justify-between border-b border-[#FAF7F2] pb-2"><span className="text-[#8C7A6E] font-medium">Age:</span><span className="font-bold text-[#1C1613]">{patient.age} Years</span></div>
        <div className="flex justify-between border-b border-[#FAF7F2] pb-2"><span className="text-[#8C7A6E] font-medium">Gender:</span><span className="font-bold text-[#1C1613]">{patient.gender}</span></div>
        <div className="flex justify-between border-b border-[#FAF7F2] pb-2"><span className="text-[#8C7A6E] font-medium">Phone:</span><span className="font-bold text-[#1C1613] font-mono">{patient.contactNumber}</span></div>
        <div className="flex justify-between"><span className="text-[#8C7A6E] font-medium">Email:</span><span className="font-bold text-[#1C1613] break-all">{patient.email || '—'}</span></div>
      </div>

      {/* Chronic History */}
      <div className="pt-5 border-t border-[#E8E2D8] space-y-3 font-['Inter',sans-serif]">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
            <Heart className="w-3.5 h-3.5 text-[#4A372E]" />
            <span>Chronic Clinical History</span>
          </h3>
          {!editing ? (
            <button 
              onClick={() => setEditing(true)} 
              className="text-[10px] text-[#4A372E] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleSaveHistory} 
                disabled={saving}
                className="text-[10px] text-[#1C1613] font-bold hover:underline cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={() => { setEditing(false); setMedicalHistory(patient.medicalHistory || ''); }} 
                disabled={saving}
                className="text-[10px] text-[#8C7A6E] font-semibold hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {msg.success && <div className="text-[10px] text-[#2D5A43] font-medium">{msg.success}</div>}
        {msg.error && <div className="text-[10px] text-[#991B1B] font-medium">{msg.error}</div>}

        {editing ? (
          <textarea
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            rows="4"
            className="w-full"
          />
        ) : (
          <p className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1613] leading-relaxed whitespace-pre-line text-xs font-medium">
            {patient.medicalHistory || 'No pre-existing clinical history or allergies declared.'}
          </p>
        )}
      </div>
    </div>
  );
}
