# 🏛️ MetraVerify - Digital Trust for Weights & Measures

**MetraVerify** is a full-stack digital verification and lifecycle management platform for statutory weighing and measuring instruments under Legal Metrology standards.

It unifies **Business Users**, **Legal Metrology Officers (LMO)**, **Government Approved Test Centres (GATC)**, and **HQ Administrators** into a single digital platform with tamper-evident QR verification and dynamic PDF certificate generation.

---

## 📁 Project Structure

```text
artisan-marketplace/
├── backend/                       # Node.js + Express REST API
│   ├── config/                    # MongoDB connection configuration
│   ├── middleware/                # Auth (JWT), RBAC, uploads, error handling
│   ├── models/                    # Mongoose Schemas (User, Instrument, Certificate, etc.)
│   ├── routes/                    # Express route handlers
│   ├── seed/                      # Seed data script for demo accounts & mock instruments
│   ├── services/                  # PDF generation, QR engine, expiry, and audit loggers
│   └── server.js                  # Express application entrypoint
│
├── frontend/                      # React 18 + Vite SPA with Tailwind CSS
│   ├── src/
│   │   ├── api/                   # Axios client with JWT interceptor
│   │   ├── components/            # Common UI components, navbars, modals, timeline
│   │   ├── context/               # Auth and Notification contexts
│   │   ├── layouts/               # DashboardLayout and PublicLayout route wrappers
│   │   ├── pages/                 # Role-based pages (admin, business, gatc, lmo, public)
│   │   └── routes/                # Protected AppRoutes definition
│   ├── index.html                 # HTML shell
│   └── vite.config.js             # Vite configuration with API proxy (port 5173 -> 5001)
│
├── docs/                          # Architecture, API, and Demo walkthroughs
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEMO.md
│
├── MetraVerify_Project_Report.md  # Comprehensive project report
├── PPT_Codebase_Comparison_Report.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** running locally on `mongodb://127.0.0.1:27017/metraverify` (or MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Seed initial database with demo users, instruments & certificates
npm run seed

# Start development server (runs on http://localhost:5001)
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 👥 Demo Roles & Quick Switcher

MetraVerify includes a built-in **Demo Quick Switcher** in the navigation bar to test all user roles instantly without manual re-login:

| Role | Name | Email | Purpose |
| :--- | :--- | :--- | :--- |
| **Admin** | Director Rajesh Sharma | `admin@metraverify.gov.in` | HQ administration, allocation, audits, analytics |
| **LMO Inspector** | Anita Deshmukh | `anita.lmo@metraverify.gov.in` | Field officer 7-point digital inspections & certificates |
| **GATC Lab** | National Metrology Lab | `gatc.delhi@metraverify.gov.in` | Laboratory calibration & test report issuance |
| **Business User** | Apex Logistics Ltd | `business@apexlogistics.in` | Instrument registry, verification applications, tracking |
| **Public User** | Unauthenticated | N/A | QR code scanning, public certificate verification |

---

## 🔒 Key Features
- **Public Tamper-Evident QR Verification**: Verify any instrument certificate directly via URL/QR scan.
- **7-Point Statutory Checklist Engine**: Mandatory inspection parameters for field officers.
- **Dynamic PDF Certificate Generation**: High-fidelity PDF creation with cryptographic QR codes via PDFKit.
- **Automated Expiry & Re-verification Alerts**: Real-time tracking and amber notification alerts for expiring instruments.
- **Tamper-Evident Audit Logging**: Immutable ledger of state transitions and administrative actions.
