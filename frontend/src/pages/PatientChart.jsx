import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Download, Activity, Calendar, Heart, AlertCircle, Trash2 } from 'lucide-react';
import EncounterForm from '../components/EncounterForm';
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
    return <div className="py-12 text-center text-slate-500 text-xs">Loading clinical records...</div>;
  }

  if (errorMsg || !patient) {
    return (
      <div className="space-y-4">
        <Link to="/patients" className="flex items-center gap-2 text-xs text-indigo-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Registry list</span>
        </Link>
        <div className="p-4 rounded-lg border border-rose-100 bg-rose-50 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500" />
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
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Registry</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePDFExport}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-350 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors text-xs cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold rounded-lg transition-all text-xs cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Patient</span>
          </button>

          {user?.role === 'Doctor' ? (
            <button
              onClick={() => setIsEncounterModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Encounter</span>
            </button>
          ) : (
            <div className="text-[10px] text-slate-500 max-w-[150px] leading-tight text-right italic font-medium">
              Read-only mode. Doctor credentials required to add logs.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg uppercase shadow-inner">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h2>
                <span className="text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 inline-block">
                  Patient Record Active
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Demographic Profile</h3>
              
              <div className="flex items-center justify-between text-slate-655">
                <span className="text-slate-450 font-medium">Age:</span>
                <span className="font-semibold text-slate-800">{patient.age} Years</span>
              </div>

              <div className="flex items-center justify-between text-slate-655">
                <span className="text-slate-450 font-medium">Gender:</span>
                <span className="font-semibold text-slate-800">{patient.gender}</span>
              </div>

              <div className="flex items-center justify-between text-slate-655">
                <span className="text-slate-450 font-medium">Phone:</span>
                <span className="font-semibold text-slate-800 font-mono">{patient.contactNumber}</span>
              </div>

              <div className="flex items-center justify-between text-slate-655">
                <span className="text-slate-450 font-medium">Email:</span>
                <span className="font-semibold text-slate-800 break-all">{patient.email || '—'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-5 border-t border-slate-100 text-xs">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Heart className="w-3.5 h-3.5 text-indigo-600" />
                <span>Chronic Clinical History</span>
              </h3>
              <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                {patient.medicalHistory || 'No pre-existing clinical history or drug allergies declared.'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-sm font-semibold text-slate-800 tracking-wide flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-indigo-606" />
              <span>Encounter History Logs</span>
            </h2>

            {encounters.length === 0 ? (
              <div className="py-12 text-center text-slate-500 italic text-xs border border-dashed border-slate-250 rounded-lg bg-slate-50/50">
                No recorded clinical encounters registered. {user?.role === 'Doctor' ? 'Use "Log Encounter" to document clinical evaluations.' : 'Waiting for Doctor evaluations.'}
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200">
                {encounters.map((enc) => {
                  const dateFormatted = new Date(enc.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div key={enc._id} className="relative pl-9 space-y-2.5">
                      <span className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center ring-4 ring-white" />

                      <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/15 space-y-4 hover:border-indigo-200 transition-colors text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <span className="font-semibold text-indigo-600">{dateFormatted}</span>
                          <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                            Dr: {enc.providerId?.name || 'Authorized clinician'}
                          </span>
                        </div>

                        {enc.vitals && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/85 p-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
                            <div>
                              <span className="text-slate-400 block mb-0.5 uppercase text-[9px]">BP:</span>
                              <span className="font-bold text-slate-800 font-mono">{enc.vitals.bloodPressure || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-0.5 uppercase text-[9px]">Temp:</span>
                              <span className="font-bold text-slate-800 font-mono">{enc.vitals.temperature || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-0.5 uppercase text-[9px]">Pulse:</span>
                              <span className="font-bold text-slate-800 font-mono">{enc.vitals.pulse || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-0.5 uppercase text-[9px]">Resp:</span>
                              <span className="font-bold text-slate-800 font-mono">{enc.vitals.respiratoryRate || '—'}</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3.5 leading-relaxed">
                          <div>
                            <span className="font-semibold text-slate-450 block mb-1 uppercase tracking-wider text-[9px]">Chief Complaint & Symptoms:</span>
                            <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">{enc.symptoms}</p>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-450 block mb-1 uppercase tracking-wider text-[9px]">Clinical Findings & Assessment:</span>
                            <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 font-medium">{enc.diagnosis}</p>
                          </div>

                          {enc.notes && (
                            <div>
                              <span className="font-semibold text-slate-450 block mb-1 uppercase tracking-wider text-[9px]">Treatment Plan & Notes:</span>
                              <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-line">{enc.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
                <h3 className="text-base font-bold text-slate-800">Delete Patient Chart</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete the clinical chart for <strong className="text-slate-800">{patient.firstName} {patient.lastName}</strong>? This action is permanent and will delete all associated medical encounter records.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-slate-100">
              <button
                disabled={deleteLoading}
                onClick={handleDeletePatient}
                className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Chart</span>
                )}
              </button>
              <button
                disabled={deleteLoading}
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-350 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
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
