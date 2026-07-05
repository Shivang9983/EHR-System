import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, Plus, User, FileText, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function Appointments() {
  const { authFetch, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Default to today
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [newAppt, setNewAppt] = useState({
    patientId: '',
    doctorId: '',
    time: '09:00 AM',
    date: '',
    reason: '',
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await authFetch('/api/appointments');
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        setErrorMsg('Failed to load appointments.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const getPatientsAndDoctors = async () => {
      try {
        const patientsRes = await authFetch('/api/patients');
        const patientsData = await patientsRes.json();
        if (patientsData.success) {
          setPatients(patientsData.patients);
          if (patientsData.patients.length > 0) {
            setNewAppt(prev => ({ ...prev, patientId: patientsData.patients[0]._id }));
          }
        }

        const doctorsRes = await authFetch('/api/auth/doctors');
        const doctorsData = await doctorsRes.json();
        if (doctorsData.success) {
          setDoctors(doctorsData.doctors);
          if (doctorsData.doctors.length > 0) {
            setNewAppt(prev => ({ ...prev, doctorId: doctorsData.doctors[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load clinic selectors:', err);
      }
    };
    getPatientsAndDoctors();
  }, []);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await authFetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientId: newAppt.patientId,
          doctorId: newAppt.doctorId,
          date: newAppt.date || selectedDate,
          time: newAppt.time,
          reason: newAppt.reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => [...prev, data.appointment]);
        setShowModal(false);
        setNewAppt(prev => ({ ...prev, reason: '', date: '' }));
      } else {
        setErrorMsg(data.message || 'Failed to create appointment.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to schedule.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await authFetch(`/api/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev =>
          prev.map(a => (a._id === id ? data.appointment : a))
        );
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    }
  };

  const apptsForSelected = appointments.filter(a => {
    const aDate = new Date(a.date).toISOString().split('T')[0];
    return aDate === selectedDate;
  });

  const getDaysInMonth = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
      const dayAppts = appointments.filter(a => {
        const aDate = new Date(a.date).toISOString().split('T')[0];
        return aDate === dateStr;
      });
      return { dayNum, dateStr, appts: dayAppts };
    });
  };

  const monthDays = getDaysInMonth(selectedDate);
  const currentMonthName = new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clinic Scheduling</h1>
          <p className="text-xs text-slate-500">Manage patient checkups, clinic agendas, and scheduling boards</p>
        </div>
        {user?.role !== 'Doctor' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 text-xs text-rose-600 border border-rose-100 rounded-lg bg-rose-50 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-4.5 h-4.5 text-indigo-600" />
              <span>{currentMonthName} Calendar</span>
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="month"
                value={selectedDate.slice(0, 7)}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(`${e.target.value}-01`);
                  }
                }}
                className="px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((d) => (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[72px] ${
                  selectedDate === d.dateStr
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-755'
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold">{d.dayNum}</span>
                {d.appts.length > 0 && (
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${
                    selectedDate === d.dateStr ? 'bg-indigo-200/50 text-indigo-800' : 'bg-slate-100 text-slate-650'
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

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Loading appointments...</div>
          ) : apptsForSelected.length === 0 ? (
            <div className="py-12 text-center text-slate-500 italic text-xs border border-dashed border-slate-250 rounded-lg bg-slate-50/50">
              No appointments scheduled.
            </div>
          ) : (
            <div className="space-y-4">
              {apptsForSelected.map((appt) => (
                <div key={appt._id} className="p-4 rounded-lg border border-slate-200 hover:border-indigo-150 transition-colors bg-slate-50/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {appt.time}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      appt.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : appt.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">
                        {appt.patientId ? `${appt.patientId.firstName} ${appt.patientId.lastName}` : 'Unknown Patient'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Clinician: {appt.doctorId?.username ? `Dr. ${appt.doctorId.username}` : 'Unassigned'}
                    </div>
                    <div className="flex items-start gap-1.5 text-[10px] text-slate-650 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{appt.reason}</span>
                    </div>
                  </div>

                  {appt.status === 'Scheduled' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-750 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-750 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
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

              <div>
                <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assign Doctor *</label>
                {doctors.length === 0 ? (
                  <div className="text-xs text-rose-500 font-semibold italic">No active Doctors registered in your organization.</div>
                ) : (
                  <select
                    value={newAppt.doctorId}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, doctorId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
                  >
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>Dr. {d.username}</option>
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
                    value={newAppt.date || selectedDate}
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
                  disabled={patients.length === 0 || doctors.length === 0}
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
