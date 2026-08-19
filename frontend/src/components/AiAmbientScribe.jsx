import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Upload, 
  FileAudio, 
  RotateCcw, 
  Check, 
  Copy, 
  AlertCircle, 
  Loader2, 
  Wand2, 
  ChevronRight, 
  FileText,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SAMPLE_TEMPLATES = [
  {
    title: 'Hypertension Follow-Up',
    text: '54yo male here for routine BP check. Taking Lisinopril 10mg daily. Denies headache, dizziness, or chest pain. Vitals recorded: BP 138/88 mmHg, Pulse 76 bpm, Temp 98.4 F, Resp 16. Lungs clear, heart regular rhythm without murmurs. Assessment: Primary hypertension, mildly elevated. Plan: Increase Lisinopril to 20mg daily, order routine metabolic panel, recheck BP in 4 weeks.',
  },
  {
    title: 'Acute Upper Respiratory Infection',
    text: '32yo female presents with 3 days of sore throat, nasal congestion, and mild productive cough. Denies shortness of breath or chest pain. Vitals: BP 118/74, Temp 100.2 F, Pulse 82 bpm, RR 18. Throat shows mild pharyngeal erythema without exudates. Clear breath sounds bilaterally. Assessment: Acute viral upper respiratory tract infection. Plan: Hydration, OTC acetaminophen 500mg q6h prn fever, rest, return if dyspnea or high fever persists over 48h.',
  },
  {
    title: 'Type 2 Diabetes Review',
    text: '61yo patient here for diabetes follow-up. Reports good compliance with Metformin 1000mg BID. Morning fasting blood sugars averaging 120-135 mg/dL. Denies polyuria, polydipsia, or peripheral neuropathy symptoms. Vitals: BP 126/80, Pulse 72, Temp 98.6 F, RR 14. Feet inspected with intact sensation bilaterally. Assessment: Type 2 Diabetes Mellitus without acute complication. Plan: Order HbA1c and lipid panel, continue Metformin, follow up in 3 months.',
  }
];

export default function AiAmbientScribe({ patientId, onApplySoap }) {
  const { authFetch } = useAuth();
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [activeSoapTab, setActiveSoapTab] = useState('all');
  const [copied, setCopied] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const recognitionRef = useRef(null);

  // Initialize Web Speech API if supported in browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition notification:', err.error);
        if (err.error !== 'no-speech') {
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    setErrorMsg('');
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. You can type or paste consultation dictation directly.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAudioUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setErrorMsg('');
    }
  };

  const handleGenerateSoap = async () => {
    if (!transcript.trim() && !audioFile) {
      setErrorMsg('Please enter or dictate consultation dialogue or upload an audio recording.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let response;
      if (audioFile) {
        const formData = new FormData();
        formData.append('audio', audioFile);
        if (transcript) formData.append('transcript', transcript);
        if (patientId) formData.append('patientId', patientId);

        const token = localStorage.getItem('user_token');
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/scribe`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        response = await authFetch('/api/ai/scribe', {
          method: 'POST',
          body: JSON.stringify({
            transcript: transcript.trim(),
            patientId,
          }),
        });
      }

      const data = await response.json();
      if (data.success && data.scribeResult) {
        setGeneratedResult(data.scribeResult);
        setSuccessMsg('Structured SOAP note compiled successfully via Gemini AI Scribe!');
      } else {
        setErrorMsg(data.message || 'AI Scribe was unable to parse consultation notes.');
      }
    } catch (err) {
      console.error('Error generating SOAP note:', err);
      setErrorMsg('Unable to connect to AI Scribe endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToEncounter = () => {
    if (!generatedResult) return;
    onApplySoap({
      symptoms: generatedResult.symptoms || '',
      diagnosis: generatedResult.diagnosis || '',
      notes: generatedResult.notes || '',
      vitals: generatedResult.vitals || {},
      soap: generatedResult.soap || {},
      aiGenerated: true,
    });
  };

  const handleCopyNote = () => {
    if (!generatedResult) return;
    const textToCopy = generatedResult.notes;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl p-5 space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1C1613] text-[#FAF7F2] flex items-center justify-center shadow-xs">
            <Sparkles className="w-4.5 h-4.5 text-[#2D5A43]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#1C1613] uppercase tracking-wide">
                AI Ambient Clinical Scribe
              </h3>
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EAF2ED] text-[#2D5A43] border border-[#D5E5D9]">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-[10px] text-[#8C7A6E]">
              Dictate or paste doctor-patient conversation to automatically format a structured SOAP note and extract vitals
            </p>
          </div>
        </div>

        {/* Live Mic Button */}
        <button
          type="button"
          onClick={toggleRecording}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer ${
            isRecording
              ? 'bg-[#991B1B] text-white animate-pulse'
              : 'bg-white border border-[#E8E2D8] text-[#1C1613] hover:bg-[#FAF7F2]'
          }`}
          title={isRecording ? 'Stop Recording' : 'Start Voice Dictation'}
        >
          {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#4A372E]" />}
          <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
        </button>
      </div>

      {/* Dictation Input Area */}
      <div className="space-y-2 font-['Inter',sans-serif]">
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows="3"
            placeholder="Speak into your microphone or paste physician notes / dialogue (e.g. 'Patient 45yo male presents with severe headache for 2 days, BP is 140/90, temp 99.1, pulse 78...')"
            className="w-full text-xs font-mono p-3 bg-white border border-[#E8E2D8] rounded-xl focus:ring-2 focus:ring-[#1C1613]/10 focus:outline-none"
          />
          {transcript && (
            <button
              type="button"
              onClick={() => setTranscript('')}
              className="absolute top-2.5 right-2.5 text-[#8C7A6E] hover:text-[#1C1613] p-1 text-[10px] bg-[#FAF7F2] rounded-md border border-[#E8E2D8] font-sans"
              title="Clear text"
            >
              Clear
            </button>
          )}
        </div>

        {/* Audio File Upload & Clinical Templates */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Templates:</span>
            {SAMPLE_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTranscript(tmpl.text)}
                className="px-2.5 py-0.5 bg-white border border-[#E8E2D8] text-[#4A372E] hover:text-[#1C1613] hover:border-[#1C1613] rounded-lg font-medium transition-colors cursor-pointer shadow-3xs"
              >
                {tmpl.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[#8C7A6E]">
            <label className="flex items-center gap-1 cursor-pointer hover:text-[#1C1613] bg-white border border-[#E8E2D8] px-2.5 py-0.5 rounded-lg shadow-3xs">
              <Upload className="w-3 h-3 text-[#4A372E]" />
              <span>{audioFile ? audioFile.name.slice(0, 16) + '...' : 'Upload Audio Note'}</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUploadChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Generate Action Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[10px]">
          {errorMsg && (
            <span className="text-[#991B1B] font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" /> {errorMsg}
            </span>
          )}
          {successMsg && <span className="text-[#2D5A43] font-bold">{successMsg}</span>}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleGenerateSoap}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-all font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI Scribe Analyzing...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate Structured SOAP Note</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Result Review & Approval Card */}
      {generatedResult && (
        <div className="p-4 bg-white rounded-2xl border border-[#E8E2D8] shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D8] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D5A43] animate-ping" />
              <span className="text-xs font-bold text-[#1C1613]">
                AI Generated Clinical Assessment (Ready for Review)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyNote}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-[#4A372E] hover:text-[#1C1613] bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#2D5A43]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy SOAP'}</span>
              </button>

              <button
                type="button"
                onClick={handleApplyToEncounter}
                className="flex items-center gap-1 px-3 py-1 bg-[#1C1613] hover:bg-[#4A372E] text-white text-xs font-bold rounded-lg cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply to Encounter Form</span>
              </button>
            </div>
          </div>

          {/* Vitals Extracted Strip */}
          {generatedResult.vitals && Object.values(generatedResult.vitals).some(v => v !== '' && v !== null) && (
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8] flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1C1613] font-mono">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#4A372E] font-sans">
                <Activity className="w-3.5 h-3.5" /> Extracted Vitals:
              </span>
              {generatedResult.vitals.bloodPressure && (
                <span>BP: <strong>{generatedResult.vitals.bloodPressure}</strong></span>
              )}
              {generatedResult.vitals.temperature && (
                <span>Temp: <strong>{generatedResult.vitals.temperature}°F</strong></span>
              )}
              {generatedResult.vitals.pulse && (
                <span>Pulse: <strong>{generatedResult.vitals.pulse} bpm</strong></span>
              )}
              {generatedResult.vitals.respiratoryRate && (
                <span>Resp: <strong>{generatedResult.vitals.respiratoryRate}/min</strong></span>
              )}
            </div>
          )}

          {/* SOAP Breakdown Tabs */}
          <div className="space-y-2 font-['Inter',sans-serif]">
            <div className="flex border-b border-[#E8E2D8] text-[11px] font-bold gap-1 font-['Plus_Jakarta_Sans',sans-serif]">
              {['all', 'subjective', 'objective', 'assessment', 'plan'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSoapTab(tab)}
                  className={`px-3 py-1.5 capitalize transition-colors cursor-pointer border-b-2 ${
                    activeSoapTab === tab
                      ? 'border-[#1C1613] text-[#1C1613] font-bold'
                      : 'border-transparent text-[#8C7A6E] hover:text-[#1C1613]'
                  }`}
                >
                  {tab === 'all' ? 'Full SOAP' : tab}
                </button>
              ))}
            </div>

            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] text-xs leading-relaxed max-h-56 overflow-y-auto">
              {activeSoapTab === 'all' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#4A372E] uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                      [S] Subjective
                    </span>
                    <p className="text-[#1C1613] mt-0.5">{generatedResult.soap.subjective}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#4A372E] uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                      [O] Objective
                    </span>
                    <p className="text-[#1C1613] mt-0.5">{generatedResult.soap.objective}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#4A372E] uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                      [A] Assessment
                    </span>
                    <p className="text-[#1C1613] mt-0.5 font-semibold">{generatedResult.soap.assessment}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#4A372E] uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                      [P] Plan
                    </span>
                    <p className="text-[#1C1613] mt-0.5 whitespace-pre-line">{generatedResult.soap.plan}</p>
                  </div>
                </div>
              )}

              {activeSoapTab === 'subjective' && (
                <p className="text-[#1C1613] whitespace-pre-line">{generatedResult.soap.subjective}</p>
              )}
              {activeSoapTab === 'objective' && (
                <p className="text-[#1C1613] whitespace-pre-line">{generatedResult.soap.objective}</p>
              )}
              {activeSoapTab === 'assessment' && (
                <p className="text-[#1C1613] font-semibold whitespace-pre-line">{generatedResult.soap.assessment}</p>
              )}
              {activeSoapTab === 'plan' && (
                <p className="text-[#1C1613] whitespace-pre-line">{generatedResult.soap.plan}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
