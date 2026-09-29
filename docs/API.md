# 🔌 MetraVerify REST API Documentation

Base URL: `http://localhost:5001/api`

All private endpoints require the HTTP Header:
`Authorization: Bearer <jwt_token>`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Register a new stakeholder user.
- **Access**: Public
- **Body**:
  ```json
  {
    "fullName": "Vikram Malhotra",
    "email": "business@metraverify.demo",
    "password": "Business@123",
    "phone": "+91 98711 55667",
    "role": "BUSINESS_USER",
    "organizationName": "Apex Logistics Pvt Ltd",
    "address": "Plot 45, Udyog Vihar",
    "state": "Haryana",
    "district": "Gurugram"
  }
  ```
- **Response** `201 Created`: Returns JWT token and sanitized user profile.

### `POST /api/auth/login`
Authenticate existing user.
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "business@metraverify.demo",
    "password": "Business@123"
  }
  ```
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "_id": "...", "fullName": "...", "role": "..." }
  }
  ```

### `GET /api/auth/me`
Retrieve currently logged-in user profile.
- **Access**: Private (All authenticated roles)

---

## 2. Instruments (`/api/instruments`)

### `POST /api/instruments`
Register a new weighing/measuring instrument.
- **Access**: Private (`BUSINESS_USER`, `ADMIN`)
- **Body**:
  ```json
  {
    "instrumentType": "Electronic Weighbridge",
    "category": "Industrial",
    "manufacturer": "Essae-Teraoka Ltd",
    "model": "WB-60T Pitless",
    "serialNumber": "ESS-2024-WB-9912",
    "capacity": "60 Metric Tonnes x 10kg",
    "accuracyClass": "Class III (Medium)",
    "locationAddress": "Warehouse Bay 3",
    "state": "Haryana",
    "district": "Gurugram"
  }
  ```

### `GET /api/instruments`
List instruments with filters (`status`, `search`, `category`, `district`, `state`).
- **Access**: Private (`BUSINESS_USER` sees own instruments; `ADMIN` and `LMO_OFFICER` see all).

### `GET /api/instruments/:id`
Retrieve detailed instrument info, owner, active certificate, and application history.
- **Access**: Private

---

## 3. Applications (`/api/applications`)

### `POST /api/applications`
Submit application for verification or re-verification.
- **Access**: Private (`BUSINESS_USER`, `ADMIN`)
- **Body**:
  ```json
  {
    "instrumentId": "6aba8412cf26...",
    "applicationType": "NEW_VERIFICATION",
    "preferredDate": "2026-10-15",
    "preferredLocation": "On-site Facility",
    "notes": "Annual statutory verification"
  }
  ```

### `GET /api/applications`
List verification applications with search and status filters.

### `POST /api/applications/:id/assign`
Assign application to an LMO officer or GATC laboratory.
- **Access**: Private (`ADMIN`)
- **Body**:
  ```json
  {
    "assignedToType": "LMO",
    "assignedOfficerId": "6aba8412...",
    "scheduledDate": "2026-10-18T10:00:00.000Z",
    "scheduledSlot": "10:00 AM - 01:00 PM"
  }
  ```

---

## 4. Digital Inspections (`/api/inspections`)

### `POST /api/inspections/start`
Start or resume an inspection session for an assigned case.
- **Access**: Private (`LMO_OFFICER`, `GATC`, `ADMIN`)
- **Body**: `{ "applicationId": "6aba84..." }`

### `POST /api/inspections/:id/complete`
Evaluate 7-point checklist, submit observations, and execute pass/fail stamping.
- **Access**: Private (`LMO_OFFICER`, `GATC`, `ADMIN`)
- **Body**:
  ```json
  {
    "checks": {
      "instrumentCondition": "PASS",
      "display": "PASS",
      "zeroError": "PASS",
      "accuracy": "PASS",
      "calibration": "PASS",
      "sealingStamping": "PASS",
      "physicalCondition": "PASS"
    },
    "remarks": "Standard 20kg weights applied; corner error <= 0.05%.",
    "officerNotes": "Lead wire seal LM-SEAL-2026 affixed.",
    "finalDecision": "PASS"
  }
  ```
- **Response**: Generates Digital Certificate, QR code, updates application to `CERTIFICATE_ISSUED`, and notifies applicant.

---

## 5. Certificates (`/api/certificates`)

### `GET /api/certificates`
List certificates with status, search, and date filters.

### `GET /api/certificates/:id`
Retrieve certificate details, QR data, and stamped parameters.

### `GET /api/certificates/:id/pdf`
Stream official downloadable PDF certificate.
- **Access**: Public / Private

### `POST /api/certificates/:id/revoke`
Revoke certificate due to broken seal, tampering, or fraud.
- **Access**: Private (`ADMIN`, `LMO_OFFICER`)

---

## 6. Public Verification (`/api/public`)

### `GET /api/public/verify/:certificateNumber`
Unauthenticated endpoint for public QR code scanning and certificate lookup.
- **Access**: Public (No auth required)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "isAuthentic": true,
      "certificateNumber": "CERT-2026-001001",
      "status": "VALID",
      "instrumentType": "Electronic Weighbridge",
      "businessName": "Apex Logistics Pvt Ltd",
      "verificationDate": "2026-04-15",
      "validUntil": "2027-04-15",
      "daysRemaining": 199,
      "digitalStampCode": "LM-STAMP-001001",
      "portalVerificationBadge": "Verified through MetraVerify Digital Verification Portal"
    }
  }
  ```

---

## 7. Dashboards (`/api/dashboard`)

- `GET /api/dashboard/business`: Metrics, expiring soon alerts, status distribution, monthly trends.
- `GET /api/dashboard/lmo`: Today's queue, pending inspections, completed inspections.
- `GET /api/dashboard/gatc`: Lab test queue, referred bench cases, calibration metrics.
- `GET /api/dashboard/admin`: High-level metrics, 4 Recharts data sets, user counts, caseload distribution.

---

## 8. Audit Logs (`/api/audit-logs`)
- `GET /api/audit-logs`: Chronological audit trail for governance and compliance.
