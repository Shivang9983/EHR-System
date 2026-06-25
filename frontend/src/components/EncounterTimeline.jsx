import React from 'react';
import { Calendar, Activity, ChevronRight } from 'lucide-react';

export default function EncounterTimeline({ encounters, user }) {
  if (encounters.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 italic text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        No recorded clinical encounters registered for this chart.
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200">
      {encounters.map((enc) => {
        const dateFormatted = new Date(enc.date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return (
          <div key={enc._id} className="relative pl-9 space-y-2 text-xs">
            <span className="absolute left-2.5 top-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-650 ring-4 ring-white" />

            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 hover:border-indigo-150 transition-colors shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-800">{dateFormatted}</span>
                <span className="text-[10px] text-indigo-755 font-bold bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/50 capitalize">
                  Dr: {enc.providerId?.username || 'Authorized Staff'}
                </span>
              </div>

              {enc.vitals && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
                  <div>
                    <span className="text-slate-400 block mb-0.5 uppercase text-[9px] font-bold">BP</span>
                    <span className="font-extrabold text-slate-800 font-mono">{enc.vitals.bloodPressure || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 uppercase text-[9px] font-bold">Temp (°F)</span>
                    <span className="font-extrabold text-slate-800 font-mono">{enc.vitals.temperature || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 uppercase text-[9px] font-bold">Pulse (bpm)</span>
                    <span className="font-extrabold text-slate-800 font-mono">{enc.vitals.pulse || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 uppercase text-[9px] font-bold">Resp. Rate</span>
                    <span className="font-extrabold text-slate-800 font-mono">{enc.vitals.respiratoryRate || '—'}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3.5 leading-relaxed">
                <div>
                  <span className="font-bold text-slate-450 block mb-1 uppercase tracking-wide text-[9px]">Symptoms & Chief Complaint</span>
                  <p className="text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200">{enc.symptoms}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-450 block mb-1 uppercase tracking-wide text-[9px]">Diagnosis & Assessment</span>
                  <p className="text-slate-800 bg-indigo-50/10 p-2.5 rounded-lg border border-indigo-100/50 font-semibold">{enc.diagnosis}</p>
                </div>

                {enc.notes && (
                  <div>
                    <span className="font-bold text-slate-450 block mb-1 uppercase tracking-wide text-[9px]">Treatment Plan & Clinical Notes</span>
                    <p className="text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200 whitespace-pre-line leading-relaxed">{enc.notes}</p>
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
