import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import PublicCertificateVerificationPage from '../pages/public/PublicCertificateVerificationPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import AboutPage from '../pages/public/AboutPage';

// Business Portal Pages
import BusinessDashboard from '../pages/business/BusinessDashboard';
import InstrumentList from '../pages/business/InstrumentList';
import AddInstrument from '../pages/business/AddInstrument';
import InstrumentDetails from '../pages/business/InstrumentDetails';
import ApplicationList from '../pages/business/ApplicationList';
import CreateApplication from '../pages/business/CreateApplication';
import ApplicationDetails from '../pages/business/ApplicationDetails';
import CertificateList from '../pages/business/CertificateList';
import CertificateDetails from '../pages/business/CertificateDetails';
import BusinessProfile from '../pages/business/BusinessProfile';
import NotificationsPage from '../pages/business/NotificationsPage';

// LMO Officer Portal Pages
import LMODashboard from '../pages/lmo/LMODashboard';
import AssignedApplications from '../pages/lmo/AssignedApplications';
import InspectionPage from '../pages/lmo/InspectionPage';
import InspectionHistory from '../pages/lmo/InspectionHistory';
import LMOCertificates from '../pages/lmo/LMOCertificates';
import LMOProfile from '../pages/lmo/LMOProfile';

// GATC Portal Pages
import GATCDashboard from '../pages/gatc/GATCDashboard';
import GATCApplications from '../pages/gatc/GATCApplications';
import GATCInspection from '../pages/gatc/GATCInspection';
import GATCHistory from '../pages/gatc/GATCHistory';
import GATCCertificates from '../pages/gatc/GATCCertificates';
import GATCReports from '../pages/gatc/GATCReports';
import GATCNotifications from '../pages/gatc/GATCNotifications';
import GATCProfile from '../pages/gatc/GATCProfile';

// Admin Portal Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ApplicationManagement from '../pages/admin/ApplicationManagement';
import InstrumentManagement from '../pages/admin/InstrumentManagement';
import UserManagement from '../pages/admin/UserManagement';
import OfficerManagement from '../pages/admin/OfficerManagement';
import GATCManagement from '../pages/admin/GATCManagement';
import CertificateManagement from '../pages/admin/CertificateManagement';
import AuditLogs from '../pages/admin/AuditLogs';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import AdminProfile from '../pages/admin/AdminProfile';
import OfficerAllocationPage from '../pages/admin/OfficerAllocationPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<PublicCertificateVerificationPage />} />
        <Route path="/verify/:certificateNumber" element={<PublicCertificateVerificationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Business User Portal */}
      <Route element={<DashboardLayout allowedRoles={['BUSINESS_USER', 'ADMIN']} />}>
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/business/instruments" element={<InstrumentList />} />
        <Route path="/business/instruments/new" element={<AddInstrument />} />
        <Route path="/business/instruments/:id" element={<InstrumentDetails />} />
        <Route path="/business/applications" element={<ApplicationList />} />
        <Route path="/business/applications/new" element={<CreateApplication />} />
        <Route path="/business/applications/:id" element={<ApplicationDetails />} />
        <Route path="/business/certificates" element={<CertificateList />} />
        <Route path="/business/certificates/:id" element={<CertificateDetails />} />
        <Route path="/business/profile" element={<BusinessProfile />} />
        <Route path="/business/notifications" element={<NotificationsPage />} />
      </Route>

      {/* LMO Officer Portal */}
      <Route element={<DashboardLayout allowedRoles={['LMO_OFFICER', 'ADMIN']} />}>
        <Route path="/lmo/dashboard" element={<LMODashboard />} />
        <Route path="/lmo/applications" element={<AssignedApplications />} />
        <Route path="/lmo/inspect/:applicationId" element={<InspectionPage />} />
        <Route path="/lmo/history" element={<InspectionHistory />} />
        <Route path="/lmo/certificates" element={<LMOCertificates />} />
        <Route path="/lmo/profile" element={<LMOProfile />} />
      </Route>

      {/* GATC Portal */}
      <Route element={<DashboardLayout allowedRoles={['GATC', 'ADMIN']} />}>
        <Route path="/gatc/dashboard" element={<GATCDashboard />} />
        <Route path="/gatc/applications" element={<GATCApplications />} />
        <Route path="/gatc/inspect/:applicationId" element={<GATCInspection />} />
        <Route path="/gatc/history" element={<GATCHistory />} />
        <Route path="/gatc/certificates" element={<GATCCertificates />} />
        <Route path="/gatc/reports" element={<GATCReports />} />
        <Route path="/gatc/notifications" element={<GATCNotifications />} />
        <Route path="/gatc/profile" element={<GATCProfile />} />
      </Route>

      {/* Admin Portal */}
      <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/allocation" element={<OfficerAllocationPage />} />
        <Route path="/admin/allocation/:id" element={<OfficerAllocationPage />} />
        <Route path="/admin/applications" element={<ApplicationManagement />} />
        <Route path="/admin/instruments" element={<InstrumentManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/officers" element={<OfficerManagement />} />
        <Route path="/admin/gatcs" element={<GATCManagement />} />
        <Route path="/admin/certificates" element={<CertificateManagement />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
