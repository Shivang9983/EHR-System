import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Search, UserPlus, ClipboardList } from 'lucide-react';
import PatientForm from '../components/PatientForm';

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPatients: 0, totalEncounters: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/patients');
      const data = await res.json();

      if (data.success) {
        setRecentPatients(data.patients.slice(0, 5));
        setStats({
          totalPatients: data.patients.length,
          totalEncounters: data.patients.length * 2,
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const searchDelay = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const res = await authFetch(`/api/patients?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.patients);
        }
      } catch (err) {
        console.error('Search query failure:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchDelay);
  }, [searchQuery]);

  const handlePatientCreated = (newPatient) => {
    loadDashboardData();
    navigate(`/patients/${newPatient._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Welcome back, <span className="text-indigo-600">{user?.username}</span> 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Clinical Overview Dashboard • Logged as <span className="font-semibold text-slate-700 capitalize">{user?.role?.toLowerCase()}</span>
          </p>
        </div>
        <button
          onClick={() => setIsPatientModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Patients</span>
            <div className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.totalPatients}</div>
            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Active records</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Encounters</span>
            <div className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.totalEncounters}</div>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded font-medium">Estimated timelines</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-600" />
          <span>Quick Patient Search</span>
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name or phone number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm transition-all"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
        </div>

        {searchQuery.trim().length > 0 && (
          <div className="border border-slate-200 rounded-lg bg-slate-50/50 overflow-hidden divide-y divide-slate-200 text-sm">
            {searchLoading ? (
              <div className="p-4 text-center text-slate-500 text-xs">Searching directories...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">No records matched your search query.</div>
            ) : (
              searchResults.map((pat) => (
                <Link
                  key={pat._id}
                  to={`/patients/${pat._id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-100/50 transition-colors text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800">
                      {pat.firstName} {pat.lastName}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Age: {pat.age} | Gender: {pat.gender} | Contact: {pat.contactNumber}
                    </p>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-semibold hover:underline">
                    Open Chart &rarr;
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Recently Registered Patients
        </h2>
        {loading ? (
          <div className="text-slate-500 text-xs">Loading patient list...</div>
        ) : recentPatients.length === 0 ? (
          <div className="text-slate-500 text-xs italic">Registry is empty. Register a patient to begin.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4">Age</th>
                  <th className="py-2.5 px-4">Gender</th>
                  <th className="py-2.5 px-4">Contact Phone</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentPatients.map((pat) => (
                  <tr key={pat._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {pat.firstName} {pat.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{pat.age} Years</td>
                    <td className="py-3 px-4 text-slate-600">{pat.gender}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{pat.contactNumber}</td>
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
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onPatientCreated={handlePatientCreated}
      />
    </div>
  );
}
