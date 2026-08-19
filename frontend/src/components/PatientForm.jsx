import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1613]/40 backdrop-blur-xs font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl border border-[#E8E2D8] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#1C1613]">
            <UserPlus className="w-4.5 h-4.5 text-[#4A372E]" />
            <h2 className="text-sm font-bold text-[#1C1613]">Register New Patient Chart</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#8C7A6E] hover:text-[#1C1613] font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-['Inter',sans-serif]">
          {errorMsg && (
            <div className="p-3.5 text-xs text-[#991B1B] border border-[#FEE2E2] rounded-xl bg-[#FDF2F2] font-medium shadow-2xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. John"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Age *</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 35"
                min="1"
                max="120"
                className="w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Contact Number *</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 555-0199"
                className="w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john.doe@email.com"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">Chronic Clinical History & Allergies</label>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows="3"
              placeholder="Declared chronic illnesses, pre-existing conditions, drug allergies, etc..."
              className="w-full text-xs"
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
              className="px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl text-xs cursor-pointer transition-all disabled:opacity-50 shadow-3xs flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Patient</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
