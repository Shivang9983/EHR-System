import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, UserPlus, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import PatientForm from '../components/PatientForm';

export default function PatientList() {
  const { authFetch } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/patients');
      const data = await res.json();
      if (data.success) {
        setPatients(data.patients);
      }
    } catch (err) {
      console.error('Error fetching registry list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePatientCreated = () => {
    fetchPatients();
  };

  const finalPatients = patients
    .filter((pat) => {
      const nameMatch = `${pat.firstName} ${pat.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      const contactMatch = pat.contactNumber.includes(searchQuery);
      const genderMatch = genderFilter === 'All' || pat.gender === genderFilter;

      return (nameMatch || contactMatch) && genderMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      } else if (sortBy === 'age') {
        return b.age - a.age;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Patient Registry</h1>
          <p className="text-xs text-slate-500">Demographic index and clinical chart access</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Patient</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-350 text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-605 shrink-0" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-indigo-605 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
          >
            <option value="name">Sort by Name (A-Z)</option>
            <option value="age">Sort by Age (Desc)</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Accessing demographics database...</div>
        ) : finalPatients.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs italic">
            No patient charts match the current search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-4">Patient Name</th>
                  <th className="py-2.5 px-4">Age</th>
                  <th className="py-2.5 px-4">Gender</th>
                  <th className="py-2.5 px-4">Contact Phone</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {finalPatients.map((pat) => (
                  <tr key={pat._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {pat.firstName} {pat.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{pat.age} Years</td>
                    <td className="py-3 px-4 text-slate-600">{pat.gender}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{pat.contactNumber}</td>
                    <td className="py-3 px-4 text-slate-500">{pat.email || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/patients/${pat._id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white font-semibold transition-all text-[10px] inline-block"
                      >
                        Open Chart
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PatientForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientCreated={handlePatientCreated}
      />
    </div>
  );
}
