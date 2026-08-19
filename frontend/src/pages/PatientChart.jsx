import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Download, Trash2, Calendar, AlertCircle } from 'lucide-react';
import EncounterForm from '../components/EncounterForm';
import PatientDemographicCard from '../components/PatientDemographicCard';
import EncounterTimeline from '../components/EncounterTimeline';
import PatientFilesSection from '../components/PatientFilesSection';
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
    return <div className="py-16 text-center text-[#8C7A6E] text-xs">Accessing clinical chart record...</div>;
  }

  if (errorMsg || !patient) {
    return (
      <div className="space-y-4 max-w-lg mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
        <Link to="/patients" className="flex items-center gap-2 text-xs text-[#4A372E] font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Patients Registry</span>
        </Link>
        <div className="p-4 rounded-2xl border border-[#FEE2E2] bg-[#FDF2F2] text-[#991B1B] text-xs flex items-center gap-3 font-semibold shadow-2xs">
          <AlertCircle className="w-5 h-5 text-[#991B1B] shrink-0" />
          <span>{errorMsg || 'Demographic file could not be read.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/patients"
          className="flex items-center gap-2 text-xs text-[#8C7A6E] hover:text-[#1C1613] transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePDFExport}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-[#E8E2D8] text-[#1C1613] hover:bg-[#FAF7F2] font-bold rounded-xl transition-all text-xs cursor-pointer shadow-3xs"
          >
            <Download className="w-4 h-4 text-[#8C7A6E]" />
            <span>Download Report</span>
          </button>

          {['Admin', 'Doctor'].includes(user?.role) && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2 bg-[#FDF2F2] border border-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2] font-bold rounded-xl transition-all text-xs cursor-pointer shadow-3xs"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>Delete Patient</span>
            </button>
          )}

          {['Admin', 'Doctor'].includes(user?.role) ? (
            <button
              onClick={() => setIsEncounterModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1C1613] hover:bg-[#4A372E] text-white font-bold rounded-xl shadow-xs transition-colors text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Encounter</span>
            </button>
          ) : (
            <div className="text-[10px] text-[#8C7A6E] max-w-[150px] leading-tight text-right italic font-medium">
              Read-only mode. Doctor or Admin credentials required to add clinical notes.
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <PatientDemographicCard 
            patient={patient} 
            onUpdateSuccess={(updatedPat) => setPatient(updatedPat)} 
          />
          <PatientFilesSection patientId={patientId} />
        </div>

        <div className="lg:col-span-2 space-y-6 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
            <Calendar className="w-4.5 h-4.5 text-[#4A372E]" />
            <h2 className="text-xs font-bold text-[#1C1613] uppercase tracking-wide">Clinical Timeline Logs</h2>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1613]/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FDF2F2] border border-[#FEE2E2] text-[#991B1B] flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-[#1C1613]">Delete Patient Chart</h3>
                <p className="text-xs text-[#8C7A6E] leading-relaxed font-medium font-['Inter',sans-serif]">
                  Are you sure you want to delete the clinical chart for <strong className="text-[#1C1613]">{patient.firstName} {patient.lastName}</strong>? This action is permanent and deletes all associated evaluation notes.
                </p>
              </div>
            </div>
            <div className="bg-[#FAF7F2] px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-[#E8E2D8] text-xs">
              <button
                disabled={deleteLoading}
                onClick={handleDeletePatient}
                className="w-full sm:w-auto px-4 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Chart'}
              </button>
              <button
                disabled={deleteLoading}
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E8E2D8] text-[#4A372E] hover:bg-[#FAF7F2] font-bold rounded-xl cursor-pointer transition-colors"
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
