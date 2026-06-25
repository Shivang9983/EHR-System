import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, UserPlus, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import PatientForm from '../components/PatientForm';
import { useNavigate } from 'react-router-dom';

export default function PatientList() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const filteredPatients = patients
    .filter((pat) => {
      const fullName = `${pat.firstName} ${pat.lastName}`.toLowerCase();
      const nameMatch = fullName.includes(searchQuery.toLowerCase());
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

  // Calculate Paginated Sub-array
  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  // Reset page to 1 if search/filter narrows list below index limit
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genderFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Patient Registry</h1>
          <p className="text-xs text-slate-500">Demographic indices, active clinical charts, and registry files</p>
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
            placeholder="Search by patient name or phone number..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600 shrink-0" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-indigo-600 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
          >
            <option value="name">Sort by Name (A-Z)</option>
            <option value="age">Sort by Age (Desc)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">Accessing demographics directory...</div>
        ) : paginatedPatients.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs italic">
            No patient charts match the current registry filters.
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-450 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-6">Patient Name</th>
                    <th className="py-3 px-6">Age</th>
                    <th className="py-3 px-6">Gender</th>
                    <th className="py-3 px-6">Contact Number</th>
                    <th className="py-3 px-6">Email Address</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedPatients.map((pat) => (
                    <tr key={pat._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-805">
                        {pat.firstName} {pat.lastName}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">{pat.age} Years</td>
                      <td className="py-3.5 px-6 text-slate-655">{pat.gender}</td>
                      <td className="py-3.5 px-6 text-slate-655 font-mono">{pat.contactNumber}</td>
                      <td className="py-3.5 px-6 text-slate-500">{pat.email || '—'}</td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => navigate(`/patients/${pat._id}`)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Open Chart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50 text-xs">
              <span className="text-[11px] text-slate-500">
                Showing <strong className="font-semibold text-slate-700">{startIndex + 1}</strong> to{' '}
                <strong className="font-semibold text-slate-700">
                  {Math.min(startIndex + itemsPerPage, totalItems)}
                </strong>{' '}
                of <strong className="font-semibold text-slate-700">{totalItems}</strong> clinical records
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-slate-500 px-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
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
