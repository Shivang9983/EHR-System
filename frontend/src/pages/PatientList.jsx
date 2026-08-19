import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, UserPlus, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Users } from 'lucide-react';
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genderFilter, sortBy]);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Page Title & Register Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1C1613] tracking-tight">Patient Registry Directory</h1>
          <p className="text-xs text-[#8C7A6E]">Demographic records, chronic histories, and active clinical chart files</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl shadow-xs transition-all text-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Patient</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-[#E8E2D8] text-xs shadow-2xs font-['Inter',sans-serif]">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name or phone number..."
            className="w-full pl-9"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8C7A6E]" />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#4A372E] shrink-0" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#4A372E] shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full"
          >
            <option value="name">Sort by Name (A-Z)</option>
            <option value="age">Sort by Age (Desc)</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-2xs overflow-hidden font-['Inter',sans-serif]">
        {loading ? (
          <div className="py-16 text-center text-[#8C7A6E] text-xs">Accessing demographics directory...</div>
        ) : paginatedPatients.length === 0 ? (
          <div className="py-16 text-center text-[#8C7A6E] text-xs italic">
            No patient charts match the current registry filters.
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E2D8] text-[10px] font-bold text-[#8C7A6E] uppercase tracking-wider bg-[#FAF7F2]">
                    <th className="py-3.5 px-6">Patient Name</th>
                    <th className="py-3.5 px-6">Age</th>
                    <th className="py-3.5 px-6">Gender</th>
                    <th className="py-3.5 px-6">Contact Number</th>
                    <th className="py-3.5 px-6">Email Address</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8] text-xs">
                  {paginatedPatients.map((pat) => (
                    <tr key={pat._id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-4 px-6 font-bold text-[#1C1613] font-['Plus_Jakarta_Sans',sans-serif]">
                        {pat.firstName} {pat.lastName}
                      </td>
                      <td className="py-4 px-6 text-[#4A372E]">{pat.age} Years</td>
                      <td className="py-4 px-6 text-[#4A372E]">{pat.gender}</td>
                      <td className="py-4 px-6 text-[#1C1613] font-mono">{pat.contactNumber}</td>
                      <td className="py-4 px-6 text-[#8C7A6E]">{pat.email || '—'}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/patients/${pat._id}`)}
                          className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] text-[10px] font-bold text-[#1C1613] hover:bg-[#FAF7F2] hover:border-[#1C1613] transition-colors cursor-pointer shadow-3xs"
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8E2D8] bg-[#FAF7F2] text-xs">
              <span className="text-[11px] text-[#8C7A6E]">
                Showing <strong className="font-semibold text-[#1C1613]">{startIndex + 1}</strong> to{' '}
                <strong className="font-semibold text-[#1C1613]">
                  {Math.min(startIndex + itemsPerPage, totalItems)}
                </strong>{' '}
                of <strong className="font-semibold text-[#1C1613]">{totalItems}</strong> records
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-[#E8E2D8] rounded-lg text-[#8C7A6E] hover:bg-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer shadow-3xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-[#8C7A6E] px-1 font-mono">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-[#E8E2D8] rounded-lg text-[#8C7A6E] hover:bg-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer shadow-3xs"
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
