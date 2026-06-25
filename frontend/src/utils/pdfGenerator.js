import { jsPDF } from 'jspdf';

export const generatePatientReport = (patient, encounters = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2); 

  let y = 38; 

 
  doc.setFillColor(79, 70, 229); // Indigo-600
  doc.rect(0, 0, pageWidth, 24, 'F');

  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EHR CLINICAL PORTAL', margin, 15);

  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Date generated: ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`,
    pageWidth - margin - 60,
    15
  );


  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Patient Clinical Chart Summary', margin, y);
  
  y += 10;

  
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

 
  doc.setFillColor(248, 250, 252); 
  doc.setDrawColor(226, 232, 240); 
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setTextColor(79, 70, 229); 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('Patient Information', margin + 6, y + 8);

  doc.setTextColor(15, 23, 42); 
  doc.setFontSize(9);
  
  
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', margin + 6, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.firstName} ${patient.lastName}`, margin + 20, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.text('Gender:', margin + 6, y + 25);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.gender}`, margin + 20, y + 25);

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', margin + 6, y + 33);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.email || 'N/A'}`, margin + 20, y + 33);


  doc.setFont('helvetica', 'bold');
  doc.text('Age:', margin + 95, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.age} Years`, margin + 112, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.text('Contact:', margin + 95, y + 25);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.contactNumber}`, margin + 112, y + 25);

  y += 46;

 
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Chronic Clinical History & Allergies', margin, y);

  y += 5;

  const history = patient.medicalHistory || 'No pre-existing clinical history or drug allergies declared.';
  const historyLines = doc.splitTextToSize(history, contentWidth - 12);
  const historyHeight = historyLines.length * 5 + 8;

  
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, historyHeight, 1.5, 1.5, 'FD');

  
  doc.setFillColor(79, 70, 229);
  doc.rect(margin, y, 2.5, historyHeight, 'F');

 
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(historyLines, margin + 8, y + 6);

  y += historyHeight + 12;

 
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Clinical Encounter Log Timeline', margin, y);

  y += 7;

  if (encounters.length === 0) {
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('No recorded clinical encounters registered.', margin + 4, y + 2);
  } else {
    encounters.forEach((encounter, index) => {
      const dateStr = new Date(encounter.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const provider = encounter.providerId?.username || 'Authorized Staff';
      
      const symptoms = encounter.symptoms || 'N/A';
      const diagnosis = encounter.diagnosis || 'N/A';
      const notes = encounter.notes || '—';

      const symptomsLines = doc.splitTextToSize(symptoms, contentWidth - 12);
      const diagnosisLines = doc.splitTextToSize(diagnosis, contentWidth - 12);
      const notesLines = doc.splitTextToSize(notes, contentWidth - 12);

      
      let encounterHeight = 35 + (symptomsLines.length * 5) + (diagnosisLines.length * 5) + (notesLines.length * 5);
      
     
      const hasVitals = encounter.vitals && (encounter.vitals.bloodPressure || encounter.vitals.temperature);
      if (hasVitals) encounterHeight += 12;

    
      if (y + encounterHeight > pageHeight - 25) {
        doc.addPage();
        y = 30; 
      }

      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, encounterHeight, 2, 2, 'FD');

     
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 9, 2, 2, 'F');
      doc.rect(margin, y + 7, contentWidth, 2, 'F'); // cover bottom rounded corners of background

      
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`Encounter Note #${encounters.length - index}`, margin + 6, y + 6);

      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`Date: ${dateStr}  |  Clinician: Dr. ${provider}`, pageWidth - margin - 85, y + 6);

      let innerY = y + 15;

      
      if (hasVitals) {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin + 6, innerY, contentWidth - 12, 8, 1, 1, 'FD');

        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('Vitals Metrics:', margin + 10, innerY + 5.5);

        doc.setFont('helvetica', 'normal');
        const bpVal = encounter.vitals.bloodPressure || '—';
        const tempVal = encounter.vitals.temperature ? `${encounter.vitals.temperature} °F` : '—';
        const pulseVal = encounter.vitals.pulse ? `${encounter.vitals.pulse} bpm` : '—';
        const respVal = encounter.vitals.respiratoryRate ? `${encounter.vitals.respiratoryRate}` : '—';
        
        doc.text(`BP: ${bpVal}   |   Temp: ${tempVal}   |   Pulse: ${pulseVal}   |   Resp: ${respVal}`, margin + 35, innerY + 5.5);
        innerY += 12;
      }

      
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('Chief Complaint & Symptoms:', margin + 6, innerY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(symptomsLines, margin + 6, innerY + 4.5);
      
      innerY += (symptomsLines.length * 5) + 6;

     
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Assessment & Diagnosis:', margin + 6, innerY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(diagnosisLines, margin + 6, innerY + 4.5);

      innerY += (diagnosisLines.length * 5) + 6;

      
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Plan & Notes:', margin + 6, innerY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(notesLines, margin + 6, innerY + 4.5);

      y += encounterHeight + 8;
    });
  }

  
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text('EHR Clinical Summary Report  |  Confidential Medical Record', margin, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  }

  doc.save(`Patient_Chart_Report_${patient.firstName}_${patient.lastName}.pdf`);
};


