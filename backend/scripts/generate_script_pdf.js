import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, '../../MetraVerify_Video_Demo_Script.pdf');

const doc = new PDFDocument({
  layout: 'portrait',
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 45, right: 45 },
  bufferPages: true,
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const PRIMARY = '#0f172a'; // Deep slate
const SECONDARY = '#1e3a8a'; // Deep blue
const ACCENT = '#d97706'; // Amber
const TEXT = '#334155'; // Slate text
const MUTED = '#64748b'; // Muted text
const CARD_BG = '#f8fafc';
const CARD_BORDER = '#e2e8f0';
const GREEN = '#059669';

// Helpers
const drawHeader = () => {
  doc.rect(45, 45, 505, 55).fillAndStroke(PRIMARY, PRIMARY);
  doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('METRAVERIFY', 60, 56);
  doc.fillColor(ACCENT).fontSize(9).font('Helvetica-Bold').text('OFFICIAL VIDEO DEMONSTRATION SCRIPT & PITCH GUIDE', 60, 78);
  doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text('Smart India Hackathon (SIH) & High-Stake Evaluation Blueprint', 60, 90);
  doc.y = 115;
};

const drawSectionTitle = (title) => {
  if (doc.y > 700) doc.addPage();
  doc.moveDown(0.8);
  const currentY = doc.y;
  doc.rect(45, currentY, 4, 18).fill(ACCENT);
  doc.fillColor(PRIMARY).fontSize(13).font('Helvetica-Bold').text(title, 55, currentY + 2);
  doc.moveDown(0.6);
};

const drawSceneHeader = (sceneNum, title, time, tone) => {
  if (doc.y > 660) doc.addPage();
  doc.moveDown(0.8);
  const startY = doc.y;
  doc.rect(45, startY, 505, 26).fillAndStroke(SECONDARY, SECONDARY);
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text(`SCENE ${sceneNum}: ${title.toUpperCase()}`, 55, startY + 8);
  doc.fillColor('#fde68a').fontSize(8.5).font('Helvetica').text(`Timing: ${time}  |  Tone: ${tone}`, 340, startY + 9, { align: 'right', width: 200 });
  doc.y = startY + 34;
};

const drawVisualBox = (visualText, actionText) => {
  if (doc.y > 680) doc.addPage();
  const startY = doc.y;
  doc.rect(45, startY, 505, 1).fill('#cbd5e1');
  doc.moveDown(0.3);
  doc.fillColor(SECONDARY).fontSize(8.5).font('Helvetica-Bold').text('SCREEN & MOUSE ACTION:');
  doc.fillColor(TEXT).fontSize(8.5).font('Helvetica').text(visualText, { lineGap: 2 });
  if (actionText) {
    doc.moveDown(0.2);
    doc.fillColor(GREEN).fontSize(8.5).font('Helvetica-Bold').text('KEY ACTION: ');
    doc.fillColor(TEXT).fontSize(8.5).font('Helvetica').text(actionText, { lineGap: 2 });
  }
  doc.moveDown(0.4);
};

const drawScriptBox = (spokenText) => {
  if (doc.y > 680) doc.addPage();
  const boxY = doc.y;
  doc.rect(45, boxY, 505, 0.5).fill('#e2e8f0');
  doc.moveDown(0.3);
  doc.fillColor(ACCENT).fontSize(9).font('Helvetica-Bold').text('SPOKEN SCRIPT (VOICEOVER):');
  doc.moveDown(0.2);
  doc.fillColor('#1e293b').fontSize(9).font('Helvetica-Oblique').text(`"${spokenText}"`, { lineGap: 3, indent: 10 });
  doc.moveDown(0.6);
};

// Document Content Execution
drawHeader();

// Section 1: Executive Strategy
drawSectionTitle('1. Executive Strategy & Selection Blueprint');
doc.fillColor(TEXT).fontSize(9).font('Helvetica').text(
  'To maximize selection probability, this demonstration adopts the proven Problem-Solution-Proof (PSP) structure. Evaluators review dozens of videos; starting with genuine national stakes (fraud, uncalibrated mandi scales, fake paper seals) and proving digital trust via real working code guarantees high engagement.',
  { lineGap: 2.5 }
);
doc.moveDown(0.5);

const principles = [
  '• Grab Attention in 30 Seconds: Start directly with consumer impact and legal metrology challenges.',
  '• Citizen-First Proof: Demonstrate the public, unauthenticated QR scan portal before internal portals.',
  '• 4-Role End-to-End Flow: Show Trader submission -> Admin allocation -> LMO 7-Point inspection -> Issuance.',
  '• Technical Superiority: Showcase dynamic PDF streaming, clean Non-PII QR URLs, and tamper-evident audit logs.'
];
principles.forEach(p => {
  doc.fillColor('#0f172a').fontSize(8.5).font('Helvetica').text(p, { indent: 10, lineGap: 2 });
});

// Section 2: Pre-Recording Checklist
drawSectionTitle('2. Pre-Recording Setup & 4-Tab Blueprint');
doc.fillColor(TEXT).fontSize(9).font('Helvetica').text(
  'Open four dedicated browser tabs in Google Chrome (Zoom 110%, Fullscreen) prior to hitting record to ensure zero typing delays or awkward login hiccups:',
  { lineGap: 2 }
);
doc.moveDown(0.4);

// Credential Table
const tableY = doc.y;
doc.rect(45, tableY, 505, 78).fillAndStroke(CARD_BG, CARD_BORDER);
doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica-Bold').text('Role', 55, tableY + 8);
doc.text('Demo Login Email', 140, tableY + 8);
doc.text('Password', 290, tableY + 8);
doc.text('1-Click Shortcut', 380, tableY + 8);

const creds = [
  ['Business Trader', 'business@metraverify.demo', 'Business@123', 'Click Business User card on /login'],
  ['LMO Inspector', 'lmo@metraverify.demo', 'Lmo@123', 'Click LMO Officer card on /login'],
  ['Admin Director', 'admin@metraverify.demo', 'Admin@123', 'Click Admin Director card on /login'],
  ['GATC Lab Head', 'gatc@metraverify.demo', 'Gatc@123', 'Click GATC Facility card on /login'],
];

creds.forEach((row, i) => {
  const rowY = tableY + 22 + (i * 13);
  doc.fillColor(TEXT).fontSize(8).font('Helvetica').text(row[0], 55, rowY);
  doc.text(row[1], 140, rowY);
  doc.text(row[2], 290, rowY);
  doc.fillColor(ACCENT).text(row[3], 380, rowY);
});

doc.y = tableY + 85;

// Section 3: The Script Scenes
drawSectionTitle('3. Step-by-Step Production Video Script');

// Scene 1
drawSceneHeader('1', 'The Hook & Legal Metrology Crisis', '0:00 - 0:45', 'Urgent & Authoritative');
drawVisualBox(
  'Start on the MetraVerify Landing Page (http://localhost:5173/). Slowly scroll down past the hero banner, trust metrics, and the 5-step lifecycle process.',
  'Maintain smooth, steady mouse movements. Keep the cursor focused on headline features.'
);
drawScriptBox(
  'Every single day, over 1.4 billion citizens rely on weighing and measuring instruments—from grocery scales and gold balances to 60-ton highway weighbridges and fuel dispensers. Yet, the traditional Legal Metrology verification system still relies on physical paper certificates, lead seals, and manual inspection registers. This creates critical vulnerabilities: counterfeit stamping certificates, undetected expired scales, revenue leakage, and zero real-time visibility for consumers. Welcome to MetraVerify—a full-stack digital trust and lifecycle management platform built specifically for Legal Metrology governance. MetraVerify bridges Citizens, Business Traders, Legal Metrology Officers, and Administrative Headquarters into one unified, transparent, and tamper-evident digital ecosystem.'
);

// Scene 2
drawSceneHeader('2', 'Consumer Empowerment: Instant QR Verification', '0:45 - 1:30', 'Tech-Forward & Clear');
drawVisualBox(
  'Click "Verify Stamping" (/verify). Click the seeded demo button CERT-2026-001001 or enter it into the search box and press Verify Now.',
  'Show the green VALID card appear. Point out the validity countdown, digital stamp code, and issuing authority. Click "Download PDF" to show the streamed official certificate.'
);
drawScriptBox(
  'Let’s start with the consumer experience. Under MetraVerify, every verified instrument is issued a unique, tamper-evident cryptographic QR code. Any citizen can simply walk up to a scale, scan the QR code with their smartphone camera—without downloading any app—or enter the certificate number on our public portal. Instantly, the system validates the certificate status in real time. We see the instrument model, the manufacturer, the issuing officer, the exact statutory seal code, and a clear validity countdown. Notice our privacy-by-design architecture: the QR code routes through a clean, unauthenticated verification endpoint without exposing sensitive business GSTIN or confidential trader data. Consumers and enforcement squads can also view and download the official, high-fidelity digital certificate, dynamically streamed directly by our backend.'
);

// Scene 3
drawSceneHeader('3', 'Business Portal: Seamless Compliance', '1:30 - 2:15', 'Solutions-Oriented');
drawVisualBox(
  'Switch to Tab 2 (/login). Click the "Business User" demo card (Apex Logistics) and sign in. Land on /business/dashboard.',
  'Highlight the 4 KPI cards and expiry alert badges. Navigate to Instruments, then to Applications -> New Application -> select instrument and submit.'
);
drawScriptBox(
  'Now let’s switch to the Trader’s perspective. In our Business Portal, logistics companies, retail chains, and jewelers get full lifecycle visibility over their entire fleet of instruments. Our dashboard features an automated dynamic expiry engine. It categorizes instruments into Green (Valid), Amber (Expiring within 30 days), and Red (Expired). Traders can easily register a new instrument—specifying class, serial number, and maximum capacity. When an instrument nears expiry, rather than waiting in line at government offices, the trader submits a statutory re-verification application digitally with just two clicks. The application is instantly registered into the department queue, complete with an automated tracking timeline.'
);

// Scene 4
drawSceneHeader('4', 'Admin Command Hub & Officer Allocation', '2:15 - 3:00', 'Executive & Data-Driven');
drawVisualBox(
  'Switch to Tab 3 (/admin/dashboard). Showcase the Recharts status distribution chart and monthly trend bars. Click "Officer & Inspection Allocation".',
  'Demonstrate assigning an unassigned business application to a designated LMO officer in just 1 click.'
);
drawScriptBox(
  'At the Department Headquarters, the Admin Command Center provides complete state-wide operational intelligence. Leadership gets real-time analytics on pendency rates, active valid instruments, and monthly verification throughput powered by interactive visual dashboards. When new applications arrive from businesses, administrators can dynamically assign inspections to designated Legal Metrology Officers (LMOs) or Government Approved Test Centres (GATCs) based on jurisdiction and workload, completely eliminating backlogs and bureaucratic delays.'
);

// Scene 5
drawSceneHeader('5', 'LMO Portal: 7-Point Statutory Inspection Engine', '3:00 - 3:55', 'Technical & Authoritative');
drawVisualBox(
  'Switch to Tab 4 (/lmo/applications). Click "Conduct Inspection" on an assigned case to enter /lmo/inspect/:applicationId.',
  'Review the 7-Point checklist. Click top-right button "⚡ Demo Fast Pass (All 7 Checks)", type remarks "All standards verified within MPE limits", and click "Issue Certificate & Complete".'
);
drawScriptBox(
  'Now, here is the core technical innovation of MetraVerify: our 7-Point Digital Statutory Inspection Engine. When an LMO visits the site or lab, paper checklists are replaced by our structured statutory protocol: 1. Overall Instrument Condition; 2. Display readability; 3. Zero setting return; 4. Accuracy & corner eccentricity load testing; 5. Calibration repeatability against standard weights; 6. Tamper-evident sealing and stamping; 7. Environmental and operating standards. The platform enforces strict statutory compliance: every parameter must be evaluated. If even one test fails, the case is rejected with mandatory inspection remarks. Once approved, the backend atomically generates an immutable certificate record, creates the unique cryptographic QR code, and issues a tamper-evident digital stamp code on the spot!'
);

// Scene 6
drawSceneHeader('6', 'Immutable Audit Trail & Modern Architecture', '3:55 - 4:35', 'Engineering-Focused');
drawVisualBox(
  'Navigate to Admin -> Audit Logs (/admin/audit-logs). Show the chronological log table updating in real time.',
  'Highlight the exact inspection and certificate generation events with user ID, entity reference, timestamp, and IP.'
);
drawScriptBox(
  'Underpinning this entire platform is enterprise-grade security and auditability. Every sensitive action—user registration, inspection submission, certificate issuance, or revocation—is recorded in our centralized Audit Log Engine. Each record captures the actor, target entity, exact timestamp, and client IP, creating an accountable trail that safeguards statutory legal proceedings. Architecturally, MetraVerify is built with a decoupled modern stack: a high-performance React 18 single-page application styled with Tailwind CSS, backed by a scalable Node.js and Express REST API, secured via stateless JWT authentication and role-based access control, with MongoDB storing normalized relational schemas.'
);

// Scene 7
drawSceneHeader('7', 'Impact & Closing Call to Action', '4:35 - 5:00', 'Inspiring & Confident');
drawVisualBox(
  'Navigate cleanly back to the main landing page hero section (/). Keep the screen still on the title and public search bar.',
  'End with strong conviction and eye contact if using webcam overlay.'
);
drawScriptBox(
  'In summary, MetraVerify transforms Legal Metrology from a slow, paper-heavy enforcement model into a transparent, citizen-centric, and fully automated digital trust infrastructure. It empowers businesses with effortless compliance, equips officers with standardized digital tooling, arms administrators with real-time analytics, and gives every consumer the power of instant verification in the palm of their hand. Thank you for your time, and we look forward to bringing MetraVerify to national scale.'
);

// Section 4: Evaluation Q&A Cheat Sheet
drawSectionTitle('4. Jury Defense & Anticipated Questions');

const qa = [
  ['Q: How do you prevent fake QR codes?', 'A: QR codes only contain a clean lookup path (/verify/CERT-ID). All verification details are queried in real time from the secure database, completely preventing offline tampering or fake static landing pages.'],
  ['Q: What if an instrument fails inspection?', 'A: The 7-point engine immediately rejects the application, logs statutory non-compliance grounds in the immutable audit log, and notifies the trader to calibrate and re-apply.'],
  ['Q: How does the expiry engine work?', 'A: Dynamically computes remaining days: Green (>30 days), Amber (<=30 days grace alert), Red (Expired). Statuses update across business and admin dashboards automatically.'],
  ['Q: How is this accessible in rural areas?', 'A: Completely web-based and responsive. Works on any basic smartphone camera without downloading heavy native apps or requiring high bandwidth.'],
];

qa.forEach(([q, a]) => {
  if (doc.y > 700) doc.addPage();
  doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica-Bold').text(q);
  doc.fillColor(TEXT).fontSize(8).font('Helvetica').text(a, { lineGap: 2, indent: 8 });
  doc.moveDown(0.4);
});

// Add Footer page numbers to all pages
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.rect(45, 800, 505, 0.5).fill('#cbd5e1');
  doc.fillColor(MUTED).fontSize(7.5).font('Helvetica').text(
    `MetraVerify Presentation Guide | Page ${i + 1} of ${range.count}`,
    45,
    808,
    { align: 'center', width: 505 }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log('✅ PDF generated successfully at:', outputPath);
});
