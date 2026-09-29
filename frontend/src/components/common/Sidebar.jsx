import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Scale,
  PlusCircle,
  ClipboardList,
  FileCheck,
  Award,
  Bell,
  User,
  Users,
  Building2,
  FileText,
  History,
  BarChart3,
  ShieldCheck,
  CheckCircle,
  UserCheck,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Overview' },
          { to: '/admin/allocation', icon: UserCheck, label: 'Officer & Inspection Allocation' },
          { to: '/admin/applications', icon: ClipboardList, label: 'Applications Management' },
          { to: '/admin/instruments', icon: Scale, label: 'Global Registry' },
          { to: '/admin/users', icon: Users, label: 'Stakeholders & Users' },
          { to: '/admin/officers', icon: ShieldCheck, label: 'Officers Caseload' },
          { to: '/admin/gatcs', icon: Building2, label: 'GATC Test Centres' },
          { to: '/admin/certificates', icon: Award, label: 'Digital Certificates' },
          { to: '/admin/audit-logs', icon: History, label: 'Audit Compliance Logs' },
          { to: '/admin/analytics', icon: BarChart3, label: 'Analytics & Reports' },
          { to: '/admin/profile', icon: User, label: 'HQ Admin Profile' },
        ];
      case 'LMO_OFFICER':
        return [
          { to: '/lmo/dashboard', icon: LayoutDashboard, label: 'Officer Dashboard' },
          { to: '/lmo/applications', icon: ClipboardList, label: 'Assigned Inspections' },
          { to: '/lmo/history', icon: CheckCircle, label: 'Inspection Records' },
          { to: '/lmo/certificates', icon: Award, label: 'Issued Certificates' },
          { to: '/lmo/profile', icon: User, label: 'Officer Profile' },
        ];
      case 'GATC':
        return [
          { to: '/gatc/dashboard', icon: LayoutDashboard, label: 'Test Centre Dashboard' },
          { to: '/gatc/applications', icon: ClipboardList, label: 'Verification Queue' },
          { to: '/gatc/history', icon: History, label: 'Inspection History' },
          { to: '/gatc/certificates', icon: Award, label: 'Certificate Repository' },
          { to: '/gatc/reports', icon: BarChart3, label: 'Reports' },
          { to: '/gatc/notifications', icon: Bell, label: 'Notifications' },
          { to: '/gatc/profile', icon: Building2, label: 'GATC Profile' },
        ];
      default: // BUSINESS_USER
        return [
          { to: '/business/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/business/instruments', icon: Scale, label: 'My Instruments' },
          { to: '/business/instruments/new', icon: PlusCircle, label: 'Register Instrument' },
          { to: '/business/applications', icon: ClipboardList, label: 'Verification Cases' },
          { to: '/business/applications/new', icon: FileCheck, label: 'Apply for Verification' },
          { to: '/business/certificates', icon: Award, label: 'Digital Certificates' },
          { to: '/business/notifications', icon: Bell, label: 'Expiry Alerts & Notices' },
          { to: '/business/profile', icon: User, label: 'Business Profile' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-[88px] bottom-0 left-0 w-64 bg-slate-900 text-slate-300 z-30 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Context Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
            Current Workspace
          </span>
          <span className="text-xs font-semibold text-white block mt-0.5 truncate">
            {user.organizationName || user.fullName}
          </span>
          <span className="text-[11px] text-amber-400 font-medium block truncate">
            {user.district}, {user.state}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.endsWith('dashboard')}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 bg-slate-950/20 text-[10px] text-slate-500 text-center">
          <p className="font-semibold text-slate-400">MetraVerify v1.0</p>
          <p>Legal Metrology Division</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
