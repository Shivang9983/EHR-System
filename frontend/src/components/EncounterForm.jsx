import React, { useState } from 'react';
import { X, Activity, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EncounterForm({ isOpen, onClose, patientId, onEncounterCreated }) {
  const { authFetch } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [pulse, setPulse] = useState('');
  const [respRate, setRespRate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!symptoms || !diagnosis) {
      setErrorMsg('Symptoms and Assessment fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await authFetch('/api/encounters', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          symptoms,
          diagnosis,
          notes,
          vitals: {
            bloodPressure: bp,
            temperature: temp,
            pulse: pulse,
            respiratoryRate: respRate,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        onEncounterCreated(data.encounter);
        onClose();
        setSymptoms('');
        setDiagnosis('');
        setNotes('');
        setBp('');
        setTemp('');
        setPulse('');
        setRespRate('');
      } else {
        setErrorMsg(data.message || 'Saving clinical logs failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5 text-indigo-600">
            <ClipboardList className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-800">Log Clinical Encounter</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-600 border border-rose-100 rounded-lg bg-rose-50">
              {errorMsg}
            </div>
          )}

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-250/80">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              <Activity className="w-4 h-4" />
              <span>Vitals Chart</span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="block mb-1 text-[10px] font-semibold text-slate-500 uppercase">BP (e.g. 120/80)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] font-semibold text-slate-500 uppercase">Temp (°F)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  placeholder="98.6"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] font-semibold text-slate-500 uppercase">Pulse (bpm)</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="72"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] font-semibold text-slate-500 uppercase">Resp. Rate</label>
                <input
                  type="text"
                  value={respRate}
                  onChange={(e) => setRespRate(e.target.value)}
                  placeholder="16"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Chief Complaint & Symptoms *</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows="3"
              placeholder="Primary reasons for visit, acute symptoms..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm resize-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Assessment & Diagnosis *</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows="3"
              placeholder="Clinical evaluation findings and diagnosis..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm resize-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Treatment Plan & Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Prescriptions, advice, diagnostic plans, and follow-ups..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Encounter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
