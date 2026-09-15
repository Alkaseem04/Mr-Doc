const PDFDocument = require('pdfkit');

/**
 * Generate a professional Prescription PDF stream using PDFKit
 * @param {Object} data - Processed prescription data including populated doctor, patient, appointment
 * @param {WritableStream} outputStream - Response stream (res)
 */
const generatePrescriptionPDF = (data, outputStream) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Pipe to response
  doc.pipe(outputStream);

  const primaryColor = '#1E88E5'; // Mr. Doc Primary Blue
  const textColor = '#1E293B';    // Dark Slate
  const lightBg = '#F1F5F9';      // Light Gray/Slate
  const borderColor = '#CBD5E1';  // Border Gray

  // --- HEADER SECTION ---
  // Left: Branding
  doc.fillColor(primaryColor)
     .fontSize(22)
     .font('Helvetica-Bold')
     .text('MR. DOC', 40, 40);

  doc.fillColor(textColor)
     .fontSize(9)
     .font('Helvetica')
     .text('Professional Healthcare Platform', 40, 65)
     .text('www.mrdoc.com | support@mrdoc.com', 40, 78);

  // Right: Doctor Details Letterhead
  const docName = data.doctorName ? `Dr. ${data.doctorName}` : 'Authorized Medical Practitioner';
  doc.fillColor(primaryColor)
     .fontSize(14)
     .font('Helvetica-Bold')
     .text(docName, 320, 40, { align: 'right' });

  doc.fillColor(textColor)
     .fontSize(9)
     .font('Helvetica')
     .text(`Spec: ${data.doctorSpecialization || 'General Physician'}`, 320, 58, { align: 'right' })
     .text(`Reg No: ${data.doctorLicense || 'DOC-REG-VERIFIED'}`, 320, 70, { align: 'right' })
     .text(`Hospital: ${data.hospitalName || 'Mr. Doc Healthcare Network'}`, 320, 82, { align: 'right' });

  // Divider Line
  doc.moveTo(40, 102)
     .lineTo(555, 102)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  // --- PATIENT & RX METADATA BOX ---
  const boxTop = 112;
  doc.roundedRect(40, boxTop, 515, 65, 4)
     .fillAndStroke(lightBg, borderColor);

  doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold');
  doc.text('Rx ID:', 50, boxTop + 10);
  doc.font('Helvetica').text(`#${data.prescriptionId.substring(data.prescriptionId.length - 8).toUpperCase()}`, 90, boxTop + 10);

  doc.font('Helvetica-Bold').text('Date:', 350, boxTop + 10);
  doc.font('Helvetica').text(data.createdAtDate, 390, boxTop + 10);

  doc.font('Helvetica-Bold').text('Patient:', 50, boxTop + 28);
  doc.font('Helvetica').text(data.patientName, 90, boxTop + 28);

  doc.font('Helvetica-Bold').text('Gender/Age:', 350, boxTop + 28);
  doc.font('Helvetica').text(`${data.patientGender} / ${data.patientAge}`, 420, boxTop + 28);

  doc.font('Helvetica-Bold').text('Phone:', 50, boxTop + 46);
  doc.font('Helvetica').text(data.patientPhone, 90, boxTop + 46);

  doc.font('Helvetica-Bold').text('Blood Group:', 350, boxTop + 46);
  doc.font('Helvetica').text(data.bloodGroup || 'Not Specified', 420, boxTop + 46);

  // --- CLINICAL DIAGNOSIS ---
  let currentY = 192;
  doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('CLINICAL DIAGNOSIS', 40, currentY);
  currentY += 16;
  doc.fillColor(textColor).fontSize(10).font('Helvetica').text(data.diagnosis || 'General Clinical Consultation', 40, currentY);

  // --- MEDICATIONS TABLE ---
  currentY += 25;
  doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('PRESCRIBED MEDICATIONS (Rx)', 40, currentY);
  currentY += 18;

  // Table Headers
  const tableTop = currentY;
  doc.rect(40, tableTop, 515, 20).fill(primaryColor);

  doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold');
  doc.text('#', 45, tableTop + 5, { width: 20 });
  doc.text('Medicine Name', 70, tableTop + 5, { width: 140 });
  doc.text('Dosage', 215, tableTop + 5, { width: 80 });
  doc.text('Frequency', 300, tableTop + 5, { width: 85 });
  doc.text('Duration', 390, tableTop + 5, { width: 60 });
  doc.text('Instructions', 455, tableTop + 5, { width: 95 });

  currentY = tableTop + 20;

  if (Array.isArray(data.medicines) && data.medicines.length > 0) {
    data.medicines.forEach((med, index) => {
      const rowBg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
      doc.rect(40, currentY, 515, 22).fillAndStroke(rowBg, '#E2E8F0');

      doc.fillColor(textColor).fontSize(8.5).font('Helvetica');
      doc.text(`${index + 1}`, 45, currentY + 6, { width: 20 });
      doc.font('Helvetica-Bold').text(med.name || 'Medicine', 70, currentY + 6, { width: 140 });
      doc.font('Helvetica').text(med.dosage || '-', 215, currentY + 6, { width: 80 });
      doc.text(med.frequency || '-', 300, currentY + 6, { width: 85 });
      doc.text(med.duration || '-', 390, currentY + 6, { width: 60 });
      doc.text(med.instructions || 'As advised', 455, currentY + 6, { width: 95 });

      currentY += 22;
    });
  } else {
    doc.rect(40, currentY, 515, 22).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text('No specific medications listed.', 50, currentY + 6);
    currentY += 22;
  }

  // --- ADVICE & FOLLOW UP ---
  currentY += 20;
  if (data.advice) {
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('DOCTOR\'S ADVICE & INSTRUCTIONS', 40, currentY);
    currentY += 16;
    doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text(data.advice, 40, currentY, { width: 515 });
    currentY += doc.heightOfString(data.advice, { width: 515 }) + 15;
  }

  if (data.followUpDate) {
    doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('FOLLOW-UP DATE:', 40, currentY);
    doc.fillColor(textColor).fontSize(10).font('Helvetica').text(data.followUpDate, 140, currentY);
    currentY += 25;
  }

  // --- SIGNATURE BLOCK & FOOTER ---
  const footerTop = 720;
  doc.moveTo(40, footerTop).lineTo(555, footerTop).lineWidth(1).strokeColor(borderColor).stroke();

  // Signature (Right Aligned)
  doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text('Digitally Signed by:', 380, footerTop - 40, { align: 'right' });
  doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text(docName, 380, footerTop - 25, { align: 'right' });

  // Legal Disclaimer (Bottom)
  doc.fillColor('#64748B').fontSize(7.5).font('Helvetica');
  doc.text('This digital prescription is generated electronically via Mr. Doc Healthcare Platform.', 40, footerTop + 8, { align: 'center' });
  doc.text('Valid for medical dispensing in accordance with telemedicine & digital healthcare guidelines.', 40, footerTop + 18, { align: 'center' });
  doc.text('Page 1 of 1', 40, footerTop + 30, { align: 'center' });

  // Finalize PDF
  doc.end();
};

module.exports = {
  generatePrescriptionPDF
};
