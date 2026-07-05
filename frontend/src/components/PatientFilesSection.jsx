import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Download, Trash2, ShieldAlert, File } from 'lucide-react';

export default function PatientFilesSection({ patientId }) {
  const { authFetch, user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Upload Form State
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('Medical Document');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/files/patient/${patientId}`);
      const data = await res.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error('Error fetching patient documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [patientId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Pre-fill file name if empty
      if (!fileName) {
        setFileName(file.name.split('.').slice(0, -1).join('.'));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedFile) {
      setErrorMsg('Please select a file to upload.');
      return;
    }
    if (!fileName.trim()) {
      setErrorMsg('Please provide a document name.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientId', patientId);
      formData.append('fileType', fileType);
      formData.append('name', fileName.trim());

      // Send via authFetch (needs multipart headers overridden, let's write a standard fetch call)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg('Document uploaded successfully.');
        setFiles(prev => [data.file, ...prev]);
        setFileName('');
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('patient-file-input');
        if (fileInput) fileInput.value = '';
      } else {
        setErrorMsg(data.message || 'File upload failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Unable to upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const res = await authFetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setFiles(prev => prev.filter(f => f._id !== fileId));
      } else {
        alert(data.message || 'Failed to delete file.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Scans & Medical Documents</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Upload and store patient records, prescriptions, and images</p>
        </div>
        <FileText className="w-4.5 h-4.5 text-indigo-650 shrink-0" />
      </div>

      {/* Upload Form - Doctors and Admins only */}
      {user?.role !== 'Receptionist' ? (
        <form onSubmit={handleUploadSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Document Name *</label>
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. Chest X-Ray Report"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Document Type *</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-350 text-slate-850 focus:outline-none"
              >
                <option value="Medical Document">Medical Document</option>
                <option value="Report">Report</option>
                <option value="Prescription">Prescription</option>
                <option value="Scan">Scan</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select File *</label>
              <input
                id="patient-file-input"
                type="file"
                required
                onChange={handleFileChange}
                className="w-full px-3 py-1 bg-white border border-slate-350 rounded-lg text-slate-600 focus:outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-[10px]">
              {errorMsg && <span className="text-rose-600 font-bold">{errorMsg}</span>}
              {successMsg && <span className="text-emerald-600 font-bold">{successMsg}</span>}
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-650 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-450 italic flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>Read-only access. Only Admin or Doctor roles can upload new medical records.</span>
        </div>
      )}

      {/* File List */}
      {loading ? (
        <div className="text-center text-slate-500 text-xs py-4">Reading documents index...</div>
      ) : files.length === 0 ? (
        <div className="text-center text-slate-450 text-xs py-8 border border-dashed border-slate-250 rounded-lg bg-slate-50/30 italic">
          No medical records uploaded for this patient.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
          {files.map((file) => (
            <div key={file._id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <File className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 truncate leading-snug">{file.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-indigo-650 bg-indigo-50/50 border border-indigo-100/50 rounded-md px-1.5 py-0.5 mr-2 text-[9px] uppercase tracking-wide">{file.fileType}</span>
                    {formatBytes(file.fileSize)} • By {file.uploadedBy?.username || 'Staff'} • {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-650 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4.5 h-4.5" />
                </a>
                {user?.role !== 'Receptionist' && (
                  <button
                    onClick={() => handleDeleteFile(file._id)}
                    className="p-1.5 border border-rose-100 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                    title="Delete File"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
