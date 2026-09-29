# 🎬 MetraVerify 3-5 Minute Hackathon Presentation Demo Script

Follow this step-by-step walkthrough to demonstrate the full end-to-end lifecycle to hackathon evaluators.

---

## ⏱️ Pre-Demo Checklist (30 seconds)
1. Verify backend is running on `http://localhost:5001`.
2. Verify frontend is running on `http://localhost:5173`.
3. Open `http://localhost:5173` in a clean browser window.

---

## 🎯 Scene 1: Problem & Public Transparency (1 minute)
1. **Show Landing Page (`/`)**:
   - Highlight tagline: *"Digital Trust for Weights & Measures"*.
   - Point out the 5-stage lifecycle workflow (Register -> Apply -> Inspect -> QR Certificate -> Verify Anywhere).
2. **Show Public QR Verification (`/verify/CERT-2026-001001`)**:
   - Explain: *"Any consumer, enforcement squad, or highway officer can point their camera at the physical scale's QR code without downloading an app or logging in."*
   - Point out:
     - 🟢 **VALID & CERTIFIED** status badge
     - Official digital stamp code (`LM-STAMP-001001`)
     - Days remaining counter (e.g. 199 days left)
     - Anti-tampering metadata and SIH Prototype disclaimer.

---

## 🎯 Scene 2: Business User Experience (1 minute)
1. Click **Sign In** -> click **⚡ Business User** (Apex Logistics).
2. **Business Dashboard (`/business/dashboard`)**:
   - Point out the **Amber Expiry Alert Banner**: *"2 instruments require re-verification within 30 days."*
   - Show status breakdown and monthly trends charts.
3. **Register an Instrument**:
   - Click **Register Instrument** (`/business/instruments/new`).
   - Enter instrument details (e.g. *Electronic Platform Scale*, capacity *150kg*, *Gurugram, Haryana*).
   - Click **Register Instrument** -> instrument gets assigned unique ID `INS-2026-XXXXXX`.
4. **Apply for Verification**:
   - Click **Apply for Verification** -> select preferred date and location -> Submit.
   - Application is created in status `SUBMITTED` with tracking timeline.

---

## 🎯 Scene 3: Admin Review & Officer Assignment (45 seconds)
1. In the top navbar, click **Demo Switcher** -> select **HQ Admin** (Director Rajesh Sharma).
2. **Admin Dashboard (`/admin/dashboard`)**:
   - Show high-level metrics across all districts.
3. **Application Management (`/admin/applications`)**:
   - Click on the newly submitted application.
   - Click **Assign Officer** -> select **Inspector Anita Deshmukh** (or GATC lab) -> specify inspection slot -> click **Confirm Assignment**.
   - Notice status changes to `SCHEDULED` with timeline update.

---

## 🎯 Scene 4: Field LMO Digital Inspection (1 minute)
1. In the top navbar, click **Demo Switcher** -> select **LMO Inspector** (Anita Deshmukh).
2. **LMO Queue (`/lmo/applications`)**:
   - Locate the scheduled application and click **Start Inspection**.
3. **7-Point Statutory Checklist (`/lmo/inspect/:id`)**:
   - Point out the 7 legal parameters mandated by Legal Metrology rules.
   - Show the dynamic **Calculated Summary** counter (e.g. *0/7 Passed*).
   - Click **⚡ Demo Fast Pass** to auto-evaluate all 7 checks to `PASS`.
   - Enter remarks: *"Standard 20kg Class M1 weights placed on four corners. MPE passed."*
   - Click **Pass & Issue Digital Certificate**.
4. **Instant Certification**:
   - The success modal instantly displays the new **Digital Verification Certificate Number**, **Cryptographic QR Code**, and **Digital Stamping Code**.

---

## 🎯 Scene 5: Verification & Download PDF (30 seconds)
1. On the success screen, click **Open Public QR Page**:
   - Verify the newly created certificate is live and authentic on the public registry!
2. Click **Download PDF**:
   - Show the government-grade PDF certificate complete with borders, instrument specs, validity dates, embedded QR code, and SIH prototype disclaimer.

---

## 🎯 Scene 6: Governance, Analytics & Audit (30 seconds)
1. Switch back to **HQ Admin** -> go to **Analytics & Reports (`/admin/analytics`)**:
   - Show the 4 interactive charts (Status Distribution, Trends, Types, Districts).
2. Go to **Audit Compliance Logs (`/admin/audit-logs`)**:
   - Show how every action taken during this demo (`INSTRUMENT_CREATED`, `APPLICATION_SUBMITTED`, `APPLICATION_ASSIGNED`, `INSPECTION_STARTED`, `CERTIFICATE_ISSUED`) was immutably tracked with actor, entity ID, and timestamp!

---

## 💡 Key Evaluator Takeaways to Emphasize
- **Zero-Friction Adoption**: Built-in 1-click demo accounts and public QR lookup.
- **Statutory Rigor**: Evaluates all 7 statutory checks; blocks certificate issuance on failure.
- **Cross-Jurisdiction Trust**: Centralized state/district surveillance prevents fraud across state lines.
- **End-to-End Delivery**: Truly working full-stack MVP with PDF generation, live database, and complete role workflows.
