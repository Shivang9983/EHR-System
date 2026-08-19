import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, Plus, User, FileText, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle, X } from 'lucide-react';

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
    const month = date.getMonth();
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
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1C1613] tracking-tight">Clinic Scheduling Matrix</h1>
          <p className="text-xs text-[#8C7A6E]">Manage patient consultations, clinic agendas, and scheduling boards</p>
        </div>
        {['Admin', 'Receptionist'].includes(user?.role) && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl shadow-xs transition-all text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 text-xs text-[#991B1B] border border-[#FEE2E2] rounded-xl bg-[#FDF2F2] flex items-center gap-2 font-medium shadow-2xs">
          <AlertCircle className="w-4 h-4 text-[#991B1B] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar View */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-[#1C1613] flex items-center gap-2">
              <CalendarIcon className="w-4.5 h-4.5 text-[#4A372E]" />
              <span>{currentMonthName} Calendar</span>
            </h2>
            <div className="flex items-center gap-2 text-xs font-['Inter',sans-serif]">
              <input
                type="month"
                value={selectedDate.slice(0, 7)}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(`${e.target.value}-01`);
                  }
                }}
                className="px-2.5 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg text-xs text-[#1C1613] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider mb-2">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2 font-['Inter',sans-serif]">
            {monthDays.map((d) => (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[72px] shadow-3xs ${
                  selectedDate === d.dateStr
                    ? 'bg-[#1C1613] border-[#1C1613] text-white'
                    : 'bg-white border-[#E8E2D8] hover:border-[#8C7A6E] text-[#1C1613]'
                }`}
              >
                <span className="text-[10px] font-bold font-mono">{d.dayNum}</span>
                {d.appts.length > 0 && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    selectedDate === d.dateStr ? 'bg-[#FAF7F2]/20 text-white' : 'bg-[#EAF2ED] text-[#2D5A43] border border-[#D5E5D9]'
                  }`}>
                    {d.appts.length} {d.appts.length === 1 ? 'slot' : 'slots'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-[#1C1613]">
              Agenda • {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
            <p className="text-[11px] text-[#8C7A6E] mt-0.5">Scheduled clinical slots for selected day</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#8C7A6E] text-xs">Loading appointments...</div>
          ) : apptsForSelected.length === 0 ? (
            <div className="py-12 text-center text-[#8C7A6E] italic text-xs border border-dashed border-[#E8E2D8] rounded-xl bg-[#FAF7F2]">
              No appointments scheduled for this date.
            </div>
          ) : (
            <div className="space-y-3 font-['Inter',sans-serif]">
              {apptsForSelected.map((appt) => (
                <div key={appt._id} className="p-4 rounded-xl border border-[#E8E2D8] hover:border-[#1C1613]/30 transition-colors bg-[#FAF7F2] space-y-3 text-xs shadow-3xs">
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                    <span className="font-bold text-[#1C1613] flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#4A372E]" />
                      {appt.time}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      appt.status === 'Completed'
                        ? 'bg-[#EAF2ED] text-[#2D5A43] border border-[#D5E5D9]'
                        : appt.status === 'Cancelled'
                        ? 'bg-[#FDF2F2] text-[#991B1B] border border-[#FEE2E2]'
                        : 'bg-white text-[#4A372E] border border-[#E8E2D8]'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[#1C1613]">
                      <User className="w-3.5 h-3.5 text-[#8C7A6E]" />
                      <span className="font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                        {appt.patientId ? `${appt.patientId.firstName} ${appt.patientId.lastName}` : 'Unknown Patient'}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8C7A6E] font-medium">
                      Clinician: {appt.doctorId?.username ? `Dr. ${appt.doctorId.username}` : 'Unassigned'}
                    </div>
                    <div className="flex items-start gap-1.5 text-[10px] text-[#4A372E] bg-white p-2.5 rounded-lg border border-[#E8E2D8] leading-relaxed shadow-3xs">
                      <FileText className="w-3.5 h-3.5 text-[#8C7A6E] shrink-0 mt-0.5" />
                      <span>{appt.reason}</span>
                    </div>
                  </div>

                  {appt.status === 'Scheduled' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                        className="px-2.5 py-1 bg-[#EAF2ED] hover:bg-[#D5E5D9] border border-[#D5E5D9] text-[#2D5A43] rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-3xs"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                        className="px-2.5 py-1 bg-[#FDF2F2] hover:bg-[#FEE2E2] border border-[#FEE2E2] text-[#991B1B] rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-3xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/40 backdrop-blur-xs font-['Inter',sans-serif]">
          <div className="w-full max-w-md bg-white border border-[#E8E2D8] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF7F2]">
              <h3 className="font-bold text-sm text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">Schedule Patient Checkup</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8C7A6E] hover:text-[#1C1613] text-xs font-semibold cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
              <div>
                <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">Patient Registry Chart *</label>
                {patients.length === 0 ? (
                  <div className="text-xs text-[#991B1B] font-semibold italic">No registered patient charts found. Register a patient first.</div>
                ) : (
                  <select
                    value={newAppt.patientId}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, patientId: e.target.value }))}
                    className="w-full"
                  >
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.firstName} {p.lastName} (Phone: {p.contactNumber})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">Assign Doctor *</label>
                {doctors.length === 0 ? (
                  <div className="text-xs text-[#991B1B] font-semibold italic">No active Doctors registered in your organization.</div>
                ) : (
                  <select
                    value={newAppt.doctorId}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, doctorId: e.target.value }))}
                    className="w-full"
                  >
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>Dr. {d.username}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">Date *</label>
                  <input
                    type="date"
                    required
                    value={newAppt.date || selectedDate}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">Time Slot *</label>
                  <select
                    value={newAppt.time}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full"
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
                <label className="block mb-1.5 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">Chief Complaint / Reason *</label>
                <textarea
                  required
                  value={newAppt.reason}
                  onChange={(e) => setNewAppt(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Primary visit reasons..."
                  rows="3"
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E8E2D8] text-[#8C7A6E] hover:bg-[#FAF7F2] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-3xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={patients.length === 0 || doctors.length === 0}
                  className="px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-3xs"
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
