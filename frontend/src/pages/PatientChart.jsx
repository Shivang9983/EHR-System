import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Download, Trash2, Calendar, AlertCircle } from 'lucide-react';
import EncounterForm from '../components/EncounterForm';
import PatientDemographicCard from '../components/PatientDemographicCard';
import EncounterTimeline from '../components/EncounterTimeline';
import { generatePatientReport } from '../utils/pdfGenerator';

export default function PatientChart() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const { authFetch, user } = useAuth();
  
  const [patient, setPatient] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEncounterModalOpen, setIsEncounterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const patientRes = await authFetch(`/api/patients/${patientId}`);
      const patientData = await patientRes.json();

      if (patientData.success) {
        setPatient(patientData.patient);
      } else {
        setErrorMsg(patientData.message || 'Error occurred while loading chart demographics.');
        return;
      }

      const encountersRes = await authFetch(`/api/encounters/patient/${patientId}`);
      const encountersData = await encountersRes.json();

      if (encountersData.success) {
        setEncounters(encountersData.encounters);
      }
    } catch (err) {
      console.error('Error fetching clinical chart records:', err);
      setErrorMsg('Could not establish database connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [patientId]);

  const handleEncounterCreated = () => {
    fetchChartData();
  };

  const handlePDFExport = () => {
    if (patient) {
      generatePatientReport(patient, encounters);
    }
  };

  const handleDeletePatient = async () => {
    try {
      setDeleteLoading(true);
      const res = await authFetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        navigate('/patients');
      } else {
        alert(data.message || 'Failed to delete patient chart.');
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      alert('Could not connect to server.');
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-500 text-xs">Accessing clinical chart record...</div>;
  }

  if (errorMsg || !patient) {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <Link to="/patients" className="flex items-center gap-2 text-xs text-indigo-650 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Patients Registry</span>
        </Link>
        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 text-xs flex items-center gap-3 font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMsg || 'Demographic file could not be read.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/patients"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePDFExport}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg transition-colors text-xs cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-450" />
            <span>Download Report</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100/50 hover:text-rose-700 font-bold rounded-lg transition-all text-xs cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Delete Patient</span>
          </button>

          {user?.role === 'Doctor' ? (
            <button
              onClick={() => setIsEncounterModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Encounter</span>
            </button>
          ) : (
            <div className="text-[10px] text-slate-400 max-w-[150px] leading-tight text-right italic font-medium">
              Read-only mode. Doctor credentials required to add clinical notes.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PatientDemographicCard 
            patient={patient} 
            onUpdateSuccess={(updatedPat) => setPatient(updatedPat)} 
          />
        </div>

        <div className="lg:col-span-2 space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Calendar className="w-4.5 h-4.5 text-indigo-650" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Clinical Timeline Logs</h2>
          </div>
          <EncounterTimeline encounters={encounters} user={user} />
        </div>
      </div>

      <EncounterForm
        isOpen={isEncounterModalOpen}
        onClose={() => setIsEncounterModalOpen(false)}
        patientId={patientId}
        onEncounterCreated={handleEncounterCreated}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-slate-800">Delete Patient Chart</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Are you sure you want to delete the clinical chart for <strong className="text-slate-800">{patient.firstName} {patient.lastName}</strong>? This action is permanent and deletes all associated evaluation notes.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-slate-100 text-xs">
              <button
                disabled={deleteLoading}
                onClick={handleDeletePatient}
                className="w-full sm:w-auto px-4 py-2 bg-rose-605 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Chart'}
              </button>
              <button
                disabled={deleteLoading}
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
