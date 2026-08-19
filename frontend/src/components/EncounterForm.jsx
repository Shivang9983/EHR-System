import React, { useState } from 'react';
import { ClipboardList, Activity, Sparkles, Wand2, CheckCircle2, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AiAmbientScribe from './AiAmbientScribe';

export default function EncounterForm({ isOpen, onClose, patientId, onEncounterCreated }) {
  const { authFetch } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [pulse, setPulse] = useState('');
  const [respRate, setRespRate] = useState('');

  // AI Scribe State
  const [soapData, setSoapData] = useState(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [showAiScribe, setShowAiScribe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApplySoap = ({ symptoms: newSymptoms, diagnosis: newDiagnosis, notes: newNotes, vitals: newVitals, soap: newSoap, aiGenerated }) => {
    if (newSymptoms) setSymptoms(newSymptoms);
    if (newDiagnosis) setDiagnosis(newDiagnosis);
    if (newNotes) setNotes(newNotes);
    if (newVitals) {
      if (newVitals.bloodPressure) setBp(newVitals.bloodPressure);
      if (newVitals.temperature) setTemp(String(newVitals.temperature));
      if (newVitals.pulse) setPulse(String(newVitals.pulse));
      if (newVitals.respiratoryRate) setRespRate(String(newVitals.respiratoryRate));
    }
    if (newSoap) setSoapData(newSoap);
    setIsAiGenerated(Boolean(aiGenerated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!symptoms.trim() || !diagnosis.trim()) {
      setErrorMsg('Symptoms and Assessment fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await authFetch('/api/encounters', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          symptoms: symptoms.trim(),
          diagnosis: diagnosis.trim(),
          notes: notes.trim(),
          vitals: {
            bloodPressure: bp.trim(),
            temperature: temp.trim() ? Number(temp) : null,
            pulse: pulse.trim() ? Number(pulse) : null,
            respiratoryRate: respRate.trim() ? Number(respRate) : null,
          },
          soap: soapData || undefined,
          aiGenerated: isAiGenerated,
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
        setSoapData(null);
        setIsAiGenerated(false);
      } else {
        setErrorMsg(data.message || 'Saving clinical logs failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to store encounter files on data server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/40 backdrop-blur-xs font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl border border-[#E8E2D8] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#1C1613]">
            <ClipboardList className="w-4.5 h-4.5 text-[#4A372E]" />
            <h2 className="text-sm font-bold text-[#1C1613]">Log Clinical Encounter</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAiScribe(!showAiScribe)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer ${
                showAiScribe
                  ? 'bg-[#1C1613] text-white'
                  : 'bg-white border border-[#E8E2D8] text-[#1C1613] hover:bg-[#FAF7F2]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showAiScribe ? 'Hide AI Scribe' : 'Use AI Ambient Scribe'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#8C7A6E] hover:text-[#1C1613] font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto font-['Inter',sans-serif]">
          {/* AI Ambient Scribe Drawer */}
          {showAiScribe && (
            <AiAmbientScribe
              patientId={patientId}
              onApplySoap={handleApplySoap}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 text-xs text-[#991B1B] border border-[#FEE2E2] rounded-xl bg-[#FDF2F2] font-medium shadow-2xs">
                {errorMsg}
              </div>
            )}

            {isAiGenerated && (
              <div className="p-3 bg-[#EAF2ED] border border-[#D5E5D9] text-[#2D5A43] rounded-xl text-xs flex items-center justify-between shadow-2xs font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A43]" />
                  SOAP fields auto-populated by AI Ambient Scribe. Review and modify as required.
                </span>
                <span className="text-[10px] bg-[#D5E5D9] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Review Mode
                </span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] shadow-3xs">
              <div className="flex items-center gap-1.5 mb-3 text-[10px] font-bold text-[#4A372E] tracking-wider uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                <Activity className="w-4 h-4 text-[#4A372E]" />
                <span>Vitals Checkup</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block mb-1 text-[9px] font-bold text-[#8C7A6E] uppercase font-['Plus_Jakarta_Sans',sans-serif]">BP (120/80)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[9px] font-bold text-[#8C7A6E] uppercase font-['Plus_Jakarta_Sans',sans-serif]">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    placeholder="98.6"
                    className="w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[9px] font-bold text-[#8C7A6E] uppercase font-['Plus_Jakarta_Sans',sans-serif]">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="72"
                    className="w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[9px] font-bold text-[#8C7A6E] uppercase font-['Plus_Jakarta_Sans',sans-serif]">Resp. Rate</label>
                  <input
                    type="number"
                    value={respRate}
                    onChange={(e) => setRespRate(e.target.value)}
                    placeholder="16"
                    className="w-full font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Chief Complaint & Symptoms (Subjective) *
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows="2"
                placeholder="Primary reasons for visit, acute symptoms..."
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Assessment & Clinical Diagnosis *
              </label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows="2"
                placeholder="Clinical evaluation findings and diagnosis..."
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Treatment Plan, Prescriptions & Notes (Plan)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                placeholder="Prescriptions, advice, diagnostic plans, and follow-ups..."
                className="w-full font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#E8E2D8] text-[#8C7A6E] hover:bg-[#FAF7F2] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-3xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl text-xs cursor-pointer transition-all disabled:opacity-50 shadow-xs flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Encounter...</span>
                  </>
                ) : (
                  <span>Save Encounter Chart</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
