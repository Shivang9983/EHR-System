import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PatientForm({ isOpen, onClose, onPatientCreated }) {
  const { authFetch } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!firstName || !lastName || !age || !contactNumber) {
      setErrorMsg('Please complete all required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await authFetch('/api/patients', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          age: Number(age),
          gender,
          contactNumber,
          email,
          medicalHistory,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onPatientCreated(data.patient);
        onClose();
        setFirstName('');
        setLastName('');
        setAge('');
        setGender('Male');
        setContactNumber('');
        setEmail('');
        setMedicalHistory('');
      } else {
        setErrorMsg(data.message || 'Failed to save patient record.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Database server is currently down.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5 text-indigo-600">
            <UserPlus className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-800">Register New Patient</h2>
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. John"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Age *</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 35"
                min="0"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Number *</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 555-0199"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john.doe@email.com"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Medical History / Allergies</label>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows="3"
              placeholder="Allergies, chronic diagnoses, key details..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all resize-none"
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
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
