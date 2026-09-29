import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export const buildCertificatePDF = async (certificate, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'portrait',
        size: 'A4',
        margin: 40,
      });

      // Stream directly to response
      doc.pipe(res);

      const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
      const verifyUrl = `${frontendBase}/verify/${certificate.certificateNumber}`;
      const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 130,
      });

      // Draw ornamental borders
      doc
        .lineWidth(3)
        .strokeColor('#0f172a')
        .rect(30, 30, 535, 782)
        .stroke();

      doc
        .lineWidth(1)
        .strokeColor('#d97706')
        .rect(36, 36, 523, 770)
        .stroke();

      // Header Band
      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('METRAVERIFY', 40, 55, { align: 'center', characterSpacing: 2 });

      doc
        .fontSize(10)
        .font('Helvetica-Oblique')
        .fillColor('#d97706')
        .text('Digital Trust for Weights & Measures | Legal Metrology Verification System', {
          align: 'center',
        });

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#334155')
        .text(
          certificate.issuingAuthority ||
            'GOVERNMENT OF INDIA - LEGAL METROLOGY (DEMO REGISTRY)',
          { align: 'center' }
        );

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#64748b')
        .text('Under The Legal Metrology Act & Standards Rules', {
          align: 'center',
        });

      doc.moveDown(1);

      // Certificate Title Box
      const titleBoxY = doc.y;
      doc
        .rect(70, titleBoxY, 455, 36)
        .fillAndStroke('#f8fafc', '#cbd5e1');

      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('DIGITAL VERIFICATION CERTIFICATE', 70, titleBoxY + 10, {
          align: 'center',
          characterSpacing: 1.5,
        });

      doc.moveDown(2);

      // Certificate Number & Verification Status Badge
      const statusColor =
        certificate.status === 'VALID'
          ? '#059669'
          : certificate.status === 'EXPIRING_SOON'
          ? '#d97706'
          : '#dc2626';

      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text(`Certificate No: `, 50, 190, { continued: true })
        .fillColor('#1d4ed8')
        .text(certificate.certificateNumber);

      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text(`Status: `, 380, 190, { continued: true })
        .fillColor(statusColor)
        .text(certificate.status);

      // Divider line
      doc
        .moveTo(50, 215)
        .lineTo(545, 215)
        .lineWidth(1)
        .strokeColor('#e2e8f0')
        .stroke();

      // Section: Instrument Information
      let currY = 225;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('1. INSTRUMENT PARTICULARS', 50, currY);

      currY += 20;

      const leftColX = 50;
      const rightColX = 300;

      const drawField = (label, value, x, y) => {
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#475569').text(label, x, y);
        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#0f172a')
          .text(value || 'N/A', x, y + 12);
      };

      drawField('Instrument ID:', certificate.instrumentId, leftColX, currY);
      drawField('Instrument Type:', certificate.instrumentType, rightColX, currY);

      currY += 32;
      drawField('Manufacturer:', certificate.manufacturer, leftColX, currY);
      drawField('Model No:', certificate.model, rightColX, currY);

      currY += 32;
      drawField('Serial Number:', certificate.serialNumber, leftColX, currY);
      drawField('Capacity / Range:', certificate.capacity, rightColX, currY);

      currY += 32;
      drawField('Accuracy Class:', certificate.accuracyClass || 'Class III (Medium)', leftColX, currY);
      drawField('Application ID:', certificate.applicationId, rightColX, currY);

      // Divider
      currY += 40;
      doc.moveTo(50, currY).lineTo(545, currY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();

      // Section: Ownership & Location
      currY += 12;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('2. STAKEHOLDER & LOCATION', 50, currY);

      currY += 20;
      drawField('Business Name:', certificate.businessName, leftColX, currY);
      drawField('Owner / Applicant:', certificate.ownerName, rightColX, currY);

      currY += 32;
      drawField('Jurisdiction District:', certificate.district, leftColX, currY);
      drawField('State / UT:', certificate.state, rightColX, currY);

      // Divider
      currY += 40;
      doc.moveTo(50, currY).lineTo(545, currY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();

      // Section: Verification & Validity
      currY += 12;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('3. VERIFICATION & VALIDITY TIMELINE', 50, currY);

      currY += 20;
      const vDate = new Date(certificate.verificationDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const expDate = new Date(certificate.validUntil).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      drawField('Verification Conducted On:', vDate, leftColX, currY);
      drawField('Valid Until (Periodic Stamping):', expDate, rightColX, currY);

      currY += 32;
      drawField('Inspecting Authority:', certificate.verifiedByName, leftColX, currY);
      drawField('Designation:', certificate.verifiedByDesignation || 'Legal Metrology Officer', rightColX, currY);

      // Verification QR Code & Seal Box
      currY += 48;
      const boxHeight = 135;
      doc
        .rect(50, currY, 495, boxHeight)
        .fillAndStroke('#f8fafc', '#cbd5e1');

      // Embed QR code inside the box
      doc.image(qrBuffer, 65, currY + 10, { width: 115 });

      // Verification text alongside QR
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('Tamper-Evident QR Authentication', 195, currY + 15);

      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor('#334155')
        .text(
          'Scan this QR code with any smartphone camera to instantly verify the authenticity, active status, and tampering audit trail on the public registry.',
          195,
          currY + 32,
          { width: 330, lineGap: 2 }
        );

      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor('#1d4ed8')
        .text(`Verification Portal URL: ${verifyUrl}`, 195, currY + 68, { width: 330 });

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#64748b')
        .text(`Digital Stamping Code: ${certificate.digitalStampCode || 'LM-SEAL-2026-NCT-9942'}`, 195, currY + 84);

      doc
        .fontSize(8)
        .font('Helvetica-Oblique')
        .fillColor('#059669')
        .text('Digitally stamped and verified by Legal Metrology Officer.', 195, currY + 102);

      // Disclaimer footer
      doc
        .fontSize(7.5)
        .font('Helvetica-Bold')
        .fillColor('#dc2626')
        .text(
          'IMPORTANT DISCLAIMER / SMART INDIA HACKATHON PROTOTYPE:',
          50,
          765,
          { align: 'center' }
        );

      doc
        .fontSize(7)
        .font('Helvetica')
        .fillColor('#64748b')
        .text(
          'This is a Smart India Hackathon demonstration prototype representing a digital verification workflow under Legal Metrology. It does not represent an officially issued Government of India certificate.',
          50,
          776,
          { align: 'center', width: 495 }
        );

      doc.end();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
