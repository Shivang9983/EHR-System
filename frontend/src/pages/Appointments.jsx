import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, Plus, User, FileText, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const INITIAL_MOCK_APPOINTMENTS = [
  { id: '1', patientName: 'Alexander Mercer', doctorName: 'Dr. Evelyn Carter', time: '09:00 AM', date: '2026-06-25', status: 'Confirmed', reason: 'Routine cardiovascular checkup' },
  { id: '2', patientName: 'Elena Rostova', doctorName: 'Dr. Evelyn Carter', time: '10:30 AM', date: '2026-06-25', status: 'Completed', reason: 'Post-op clinical review' },
  { id: '3', patientName: 'Marcus Aurelius', doctorName: 'Dr. Evelyn Carter', time: '02:00 PM', date: '2026-06-26', status: 'Confirmed', reason: 'Chronic hypertension consultation' },
  { id: '4', patientName: 'Clara Oswald', doctorName: 'Dr. Evelyn Carter', time: '11:15 AM', date: '2026-06-27', status: 'Confirmed', reason: 'Allergy immunotherapy followup' },
  { id: '5', patientName: 'Bruce Banner', doctorName: 'Dr. Evelyn Carter', time: '04:00 PM', date: '2026-06-28', status: 'Confirmed', reason: 'Hematology lab reports review' }
];

export default function Appointments() {
  const { authFetch } = useAuth();
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('ehr_appointments');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_APPOINTMENTS;
  });
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-06-25');
  const [newAppt, setNewAppt] = useState({ patientId: '', doctorName: 'Dr. Evelyn Carter', time: '09:00 AM', date: '2026-06-25', reason: '' });

  useEffect(() => {
    localStorage.setItem('ehr_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    const getPatients = async () => {
      try {
        const res = await authFetch('/api/patients');
        const data = await res.json();
        if (data.success) {
          setPatients(data.patients);
          if (data.patients.length > 0) {
            setNewAppt(prev => ({ ...prev, patientId: data.patients[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load patient records:', err);
      }
    };
    getPatients();
  }, []);

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p._id === newAppt.patientId);
    const patientName = pat ? `${pat.firstName} ${pat.lastName}` : 'Walk-in Patient';
    const finalAppt = {
      id: Date.now().toString(),
      patientName,
      doctorName: newAppt.doctorName,
      time: newAppt.time,
      date: newAppt.date,
      status: 'Confirmed',
      reason: newAppt.reason || 'General health evaluation'
    };
    setAppointments(prev => [...prev, finalAppt]);
    setShowModal(false);
    setNewAppt(prev => ({ ...prev, reason: '' }));
  };

  const apptsForSelected = appointments.filter(a => a.date === selectedDate);

  // Generate June 2026 days (30 days, June 1 is a Monday)
  const juneDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    const dayAppts = appointments.filter(a => a.date === dateStr);
    return { dayNum, dateStr, appts: dayAppts };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clinic Scheduling</h1>
          <p className="text-xs text-slate-500">Manage patient checkups, clinic agendas, and scheduling boards</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-4.5 h-4.5 text-indigo-600" />
              <span>June 2026 Calendar</span>
            </h2>
            <div className="flex items-center gap-1.5">
              <button disabled className="p-1 border border-slate-200 rounded-lg text-slate-450 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled className="p-1 border border-slate-200 rounded-lg text-slate-450 hover:bg-slate-50 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {juneDays.map((d) => (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[72px] ${
                  selectedDate === d.dateStr
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-755'
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold">{d.dayNum}</span>
                {d.appts.length > 0 && (
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${
                    selectedDate === d.dateStr ? 'bg-indigo-200/50 text-indigo-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {d.appts.length} {d.appts.length === 1 ? 'visit' : 'visits'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-1 p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Agenda • {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
            <p className="text-[11px] text-slate-450 mt-0.5">Scheduled clinical slots for selected day</p>
          </div>

          {apptsForSelected.length === 0 ? (
            <div className="py-12 text-center text-slate-500 italic text-xs border border-dashed border-slate-250 rounded-lg bg-slate-50/50">
              No appointments scheduled. Click "New Appointment" to book.
            </div>
          ) : (
            <div className="space-y-4">
              {apptsForSelected.map((appt) => (
                <div key={appt.id} className="p-4 rounded-lg border border-slate-200 hover:border-indigo-150 transition-colors bg-slate-50/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {appt.time}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-805">{appt.patientName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium capitalize">
                      Clinician: {appt.doctorName}
                    </div>
                    <div className="flex items-start gap-1.5 text-[10px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{appt.reason}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scheduler Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-800">Schedule Patient Checkup</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>
            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
              <div>
                <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Patient Registry Chart *</label>
                {patients.length === 0 ? (
                  <div className="text-xs text-rose-500 font-semibold italic">No registered patient charts found. Register a patient first.</div>
                ) : (
                  <select
                    value={newAppt.patientId}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, patientId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
                  >
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.firstName} {p.lastName} (Phone: {p.contactNumber})</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Date *</label>
                  <input
                    type="date"
                    required
                    value={newAppt.date}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Time Slot *</label>
                  <select
                    value={newAppt.time}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:15 AM">11:15 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Chief Complaint / Reason *</label>
                <textarea
                  required
                  value={newAppt.reason}
                  onChange={(e) => setNewAppt(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Primary visit reasons..."
                  rows="3"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={patients.length === 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
