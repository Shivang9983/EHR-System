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

    if (!firstName.trim() || !lastName.trim() || !age || !contactNumber.trim()) {
      setErrorMsg('Please complete all required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await authFetch('/api/patients', {
        method: 'POST',
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: Number(age),
          gender,
          contactNumber: contactNumber.trim(),
          email: email.trim() || undefined,
          medicalHistory: medicalHistory.trim() || 'None',
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
      setErrorMsg('Demographics server is currently unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-indigo-650">
            <UserPlus className="w-4.5 h-4.5" />
            <h2 className="text-sm font-bold text-slate-800">Register New Patient Chart</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-450 hover:text-slate-700 font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-600 border border-rose-100 rounded-lg bg-rose-50/70 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. John"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Age *</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 35"
                min="1"
                max="120"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-855 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contact Number *</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 555-0199"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john.doe@email.com"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Chronic Clinical History & Allergies</label>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows="3"
              placeholder="Declared chronic illnesses, pre-existing conditions, drug allergies, etc..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
