import React, { useState } from 'react';
import { Calendar, Activity, Sparkles, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function EncounterTimeline({ encounters, user }) {
  const [expandedSoap, setExpandedSoap] = useState({});

  const toggleSoap = (id) => {
    setExpandedSoap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (user?.role === 'Receptionist') {
    return (
      <div className="py-16 text-center text-[#8C7A6E] italic text-xs border border-dashed border-[#E8E2D8] rounded-2xl bg-white shadow-3xs">
        Confidential clinical encounters and evaluation notes are restricted to Doctor and Admin accounts.
      </div>
    );
  }

  if (encounters.length === 0) {
    return (
      <div className="py-16 text-center text-[#8C7A6E] italic text-xs border border-dashed border-[#E8E2D8] rounded-2xl bg-white shadow-3xs">
        No recorded clinical encounters registered for this chart.
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#E8E2D8] font-['Plus_Jakarta_Sans',sans-serif]">
      {encounters.map((enc) => {
        const dateFormatted = new Date(enc.date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        const hasStructuredSoap = enc.soap && (enc.soap.subjective || enc.soap.assessment || enc.soap.plan);

        return (
          <div key={enc._id} className="relative pl-9 space-y-2 text-xs font-['Inter',sans-serif]">
            <span className="absolute left-2.5 top-2.5 w-3 h-3 rounded-full bg-[#1C1613] border-2 border-[#FAF7F2] ring-4 ring-[#FAF7F2]" />

            <div className="p-5 rounded-2xl border border-[#E8E2D8] bg-white space-y-4 hover:border-[#1C1613]/30 transition-colors shadow-3xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D8] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">{dateFormatted}</span>
                  {enc.aiGenerated && (
                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EAF2ED] text-[#2D5A43] border border-[#D5E5D9]">
                      <Sparkles className="w-2.5 h-2.5 text-[#2D5A43]" /> AI Scribe Assisted
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#4A372E] font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E8E2D8] capitalize">
                  Dr: {enc.providerId?.username || 'Authorized Clinician'}
                </span>
              </div>

              {enc.vitals && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8E2D8] text-xs font-semibold text-[#4A372E] shadow-3xs font-mono">
                  <div>
                    <span className="text-[#8C7A6E] block mb-0.5 uppercase text-[9px] font-bold font-sans">BP</span>
                    <span className="font-black text-[#1C1613]">{enc.vitals.bloodPressure || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[#8C7A6E] block mb-0.5 uppercase text-[9px] font-bold font-sans">Temp (°F)</span>
                    <span className="font-black text-[#1C1613]">{enc.vitals.temperature || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[#8C7A6E] block mb-0.5 uppercase text-[9px] font-bold font-sans">Pulse (bpm)</span>
                    <span className="font-black text-[#1C1613]">{enc.vitals.pulse || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[#8C7A6E] block mb-0.5 uppercase text-[9px] font-bold font-sans">Resp. Rate</span>
                    <span className="font-black text-[#1C1613]">{enc.vitals.respiratoryRate || '—'}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3.5 leading-relaxed">
                <div>
                  <span className="font-bold text-[#8C7A6E] block mb-1 uppercase tracking-wider text-[9px] font-['Plus_Jakarta_Sans',sans-serif]">Symptoms & Chief Complaint</span>
                  <p className="text-[#1C1613] bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8]">{enc.symptoms}</p>
                </div>

                <div>
                  <span className="font-bold text-[#8C7A6E] block mb-1 uppercase tracking-wider text-[9px] font-['Plus_Jakarta_Sans',sans-serif]">Diagnosis & Assessment</span>
                  <p className="text-[#1C1613] bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8] font-semibold">{enc.diagnosis}</p>
                </div>

                {hasStructuredSoap && (
                  <div className="border border-[#E8E2D8] rounded-xl overflow-hidden bg-[#FAF7F2]">
                    <button
                      type="button"
                      onClick={() => toggleSoap(enc._id)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between bg-[#FAF7F2] text-[#1C1613] font-bold text-[10px] uppercase tracking-wider cursor-pointer hover:bg-[#EAE3D9] transition-colors font-['Plus_Jakarta_Sans',sans-serif]"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#4A372E]" /> Structured SOAP Breakdown
                      </span>
                      {expandedSoap[enc._id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {expandedSoap[enc._id] && (
                      <div className="p-4 space-y-3 text-xs divide-y divide-[#E8E2D8] bg-white">
                        {enc.soap.subjective && (
                          <div className="pt-2 first:pt-0">
                            <strong className="text-[#4A372E] block text-[10px] uppercase mb-0.5 font-['Plus_Jakarta_Sans',sans-serif]">[S] Subjective:</strong>
                            <p className="text-[#1C1613]">{enc.soap.subjective}</p>
                          </div>
                        )}
                        {enc.soap.objective && (
                          <div className="pt-2">
                            <strong className="text-[#4A372E] block text-[10px] uppercase mb-0.5 font-['Plus_Jakarta_Sans',sans-serif]">[O] Objective:</strong>
                            <p className="text-[#1C1613]">{enc.soap.objective}</p>
                          </div>
                        )}
                        {enc.soap.assessment && (
                          <div className="pt-2">
                            <strong className="text-[#4A372E] block text-[10px] uppercase mb-0.5 font-['Plus_Jakarta_Sans',sans-serif]">[A] Assessment:</strong>
                            <p className="text-[#1C1613]">{enc.soap.assessment}</p>
                          </div>
                        )}
                        {enc.soap.plan && (
                          <div className="pt-2">
                            <strong className="text-[#4A372E] block text-[10px] uppercase mb-0.5 font-['Plus_Jakarta_Sans',sans-serif]">[P] Plan:</strong>
                            <p className="text-[#1C1613] whitespace-pre-line">{enc.soap.plan}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {enc.notes && (
                  <div>
                    <span className="font-bold text-[#8C7A6E] block mb-1 uppercase tracking-wider text-[9px] font-['Plus_Jakarta_Sans',sans-serif]">Treatment Plan & Clinical Notes</span>
                    <p className="text-[#1C1613] bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8] whitespace-pre-line leading-relaxed font-mono text-xs">{enc.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
