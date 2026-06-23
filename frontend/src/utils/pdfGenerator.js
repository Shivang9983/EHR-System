import { jsPDF } from 'jspdf';

export const generatePatientReport = (patient, encounters = []) => {
const doc = new jsPDF();

let y = 20;

doc.setFontSize(18);
doc.text('Patient Report', 20, y);

y += 15;

doc.setFontSize(12);
doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 20, y);
y += 8;

doc.text(`Age: ${patient.age}`, 20, y);
y += 8;

doc.text(`Gender: ${patient.gender}`, 20, y);
y += 8;

doc.text(`Contact: ${patient.contactNumber}`, 20, y);
y += 8;

doc.text(`Email: ${patient.email || 'N/A'}`, 20, y);
y += 15;

doc.setFont(undefined, 'bold');
doc.text('Medical History', 20, y);
y += 8;

doc.setFont(undefined, 'normal');

const history = patient.medicalHistory || 'No medical history available';
const historyLines = doc.splitTextToSize(history, 170);

doc.text(historyLines, 20, y);
y += historyLines.length * 6 + 10;

doc.setFont(undefined, 'bold');
doc.text('Encounters', 20, y);
y += 10;

doc.setFont(undefined, 'normal');

if (encounters.length === 0) {
doc.text('No encounters found.', 20, y);
} else {
encounters.forEach((encounter, index) => {
if (y > 260) {
doc.addPage();
y = 20;
}

  doc.setFont(undefined, 'bold');
  doc.text(`Encounter ${index + 1}`, 20, y);
  y += 8;

  doc.setFont(undefined, 'normal');

  doc.text(
    `Date: ${new Date(encounter.date).toLocaleDateString()}`,
    20,
    y
  );
  y += 6;

  doc.text(`Symptoms: ${encounter.symptoms}`, 20, y);
  y += 6;

  doc.text(`Diagnosis: ${encounter.diagnosis}`, 20, y);
  y += 6;

  if (encounter.notes) {
    const notes = doc.splitTextToSize(
      `Notes: ${encounter.notes}`,
      170
    );

    doc.text(notes, 20, y);
    y += notes.length * 6;
  }

  y += 8;
});


}

doc.save(
`Patient_Report_${patient.firstName}_${patient.lastName}.pdf`
);
};
