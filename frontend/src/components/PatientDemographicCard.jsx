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
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
        <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center font-bold text-base uppercase shadow-inner shrink-0">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-slate-800 truncate">
            {patient.firstName} {patient.lastName}
          </h2>
          <span className="text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1.5 inline-block">
            Chart Active
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Patient Profile</h3>
        <div className="flex justify-between"><span className="text-slate-450 font-medium">Age:</span><span className="font-bold text-slate-750">{patient.age} Years</span></div>
        <div className="flex justify-between"><span className="text-slate-450 font-medium">Gender:</span><span className="font-bold text-slate-750">{patient.gender}</span></div>
        <div className="flex justify-between"><span className="text-slate-450 font-medium">Phone:</span><span className="font-bold text-slate-750 font-mono">{patient.contactNumber}</span></div>
        <div className="flex justify-between"><span className="text-slate-450 font-medium">Email:</span><span className="font-bold text-slate-750 break-all">{patient.email || '—'}</span></div>
      </div>

      <div className="pt-5 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-indigo-600" />
            <span>Chronic Clinical History</span>
          </h3>
          {!editing ? (
            <button 
              onClick={() => setEditing(true)} 
              className="text-[10px] text-indigo-650 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleSaveHistory} 
                disabled={saving}
                className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={() => { setEditing(false); setMedicalHistory(patient.medicalHistory || ''); }} 
                disabled={saving}
                className="text-[10px] text-slate-450 font-semibold hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {msg.success && <div className="text-[10px] text-emerald-600 font-medium">{msg.success}</div>}
        {msg.error && <div className="text-[10px] text-rose-600 font-medium">{msg.error}</div>}

        {editing ? (
          <textarea
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            rows="4"
            className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 resize-none transition-all"
          />
        ) : (
          <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs font-medium">
            {patient.medicalHistory || 'No pre-existing clinical history or allergies declared.'}
          </p>
        )}
      </div>
    </div>
  );
}
