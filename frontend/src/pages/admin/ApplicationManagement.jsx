import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  ClipboardList,
  Search,
  UserCheck,
  Calendar,
  Building,
  User,
  Scale,
  Eye,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const ApplicationManagement = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [gatcs, setGatcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Assignment Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedType, setAssignedType] = useState('LMO');
  const [assignedOfficerId, setAssignedOfficerId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledSlot, setScheduledSlot] = useState('10:00 AM - 01:00 PM');
  const [assignmentComments, setAssignmentComments] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, officersRes, gatcsRes] = await Promise.all([
        api.get('/applications'),
        api.get('/users/officers'),
        api.get('/users/gatcs'),
      ]);
      setApplications(appsRes.data.data || []);
      setOfficers(officersRes.data.data || []);
      setGatcs(gatcsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load application management data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && applications.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const assignId = searchParams.get('openAssign');
      if (assignId) {
        const appToAssign = applications.find(a => a.applicationId === assignId);
        if (appToAssign) {
          handleOpenAssignModal(appToAssign);
        }
      }
    }
  }, [loading, applications, location.search]);

  const handleOpenAssignModal = (app) => {
    setSelectedApp(app);
    setAssignedType(app.assignedToType || 'LMO');
    setAssignedOfficerId(app.assignedOfficer?._id || (officers[0]?._id || ''));
    setScheduledDate(
      app.scheduledDate
        ? new Date(app.scheduledDate).toISOString().split('T')[0]
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    setScheduledSlot(app.scheduledSlot || '10:00 AM - 01:00 PM');
    setAssignmentComments('');
    setModalSuccess('');
    setIsModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!assignedOfficerId || !scheduledDate) return;

    try {
      setAssigning(true);
      await api.post(`/applications/${selectedApp._id}/assign`, {
        assignedOfficerId,
        assignedToType: assignedType,
        scheduledDate,
        scheduledSlot,
        comments: assignmentComments,
      });

      setModalSuccess('Officer assigned & inspection scheduled successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        fetchData();
      }, 1200);
    } catch (err) {
      console.error('Assignment error', err);
    } finally {
      setAssigning(false);
    }
  };

  const filtered = applications.filter((app) => {
    const s = search.toLowerCase();
    const matchesSearch =
      !search ||
      app.applicationId.toLowerCase().includes(s) ||
      app.instrument?.instrumentId?.toLowerCase().includes(s) ||
      app.owner?.organizationName?.toLowerCase().includes(s) ||
      app.owner?.fullName?.toLowerCase().includes(s);

    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application & Officer Allocation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submitted requests, allocate inspecting officers or GATC testing laboratories.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Case ID, Business, Instrument ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="SUBMITTED">Submitted (Needs Assignment)</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="INSPECTION">Under Inspection</option>
          <option value="CERTIFICATE_ISSUED">Certificate Issued</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading cases...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No applications match current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Case Ref</th>
                  <th className="py-3 px-4">Enterprise</th>
                  <th className="py-3 px-4">Instrument Particulars</th>
                  <th className="py-3 px-4">Preferred / Scheduled Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Allocated Officer / Lab</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.owner?.organizationName || app.owner?.fullName}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {app.owner?.district}, {app.owner?.state}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.instrument?.instrumentType}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {app.instrument?.instrumentId} • S/N: {app.instrument?.serialNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {new Date(app.scheduledDate || app.preferredDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4">
                      {app.assignedOfficer ? (
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {app.assignedOfficer.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {app.assignedOfficer.designation || app.assignedToType}
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenAssignModal(app)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        {app.assignedOfficer ? 'Reassign / Reschedule' : 'Assign Officer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Officer & Inspection Allocation"
        subtitle={`Case ${selectedApp?.applicationId} • ${selectedApp?.instrument?.instrumentType}`}
      >
        {modalSuccess ? (
          <div className="py-6 text-center text-xs">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <span className="font-bold text-slate-800 text-sm block">{modalSuccess}</span>
          </div>
        ) : (
          <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
            {/* Target Instrument Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-800 block">
                {selectedApp?.instrument?.instrumentType} (ID: {selectedApp?.instrument?.instrumentId})
              </span>
              <span className="text-slate-500 block">
                Applicant: {selectedApp?.owner?.organizationName} ({selectedApp?.owner?.district}, {selectedApp?.owner?.state})
              </span>
              <span className="text-slate-500 block">
                Preferred Venue: {selectedApp?.preferredLocation}
              </span>
            </div>

            {/* Officer Type Toggle (LMO vs GATC) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigning Authority Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAssignedType('LMO');
                    setAssignedOfficerId(officers[0]?._id || '');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    assignedType === 'LMO'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Legal Metrology Officer (LMO)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAssignedType('GATC');
                    setAssignedOfficerId(gatcs[0]?._id || '');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    assignedType === 'GATC'
                      ? 'border-amber-600 bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Accredited Test Centre (GATC)
                </button>
              </div>
            </div>

            {/* Select Officer / GATC */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select {assignedType === 'LMO' ? 'Inspecting Officer' : 'GATC Facility'} *
              </label>
              <select
                value={assignedOfficerId}
                onChange={(e) => setAssignedOfficerId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              >
                {assignedType === 'LMO'
                  ? officers.map((off) => (
                      <option key={off._id} value={off._id}>
                        {off.fullName} - {off.designation || 'LMO'} ({off.district}, {off.state})
                      </option>
                    ))
                  : gatcs.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.organizationName || g.fullName} ({g.district}, {g.state})
                      </option>
                    ))}
              </select>
            </div>

            {/* Scheduled Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scheduled Inspection Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Time Slot
                </label>
                <select
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="All Day Bench Test">All Day Bench Test</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Administrative Notes / Instructions
              </label>
              <textarea
                rows="2"
                value={assignmentComments}
                onChange={(e) => setAssignmentComments(e.target.value)}
                placeholder="e.g. Ensure standard class F1 weights are carried for this precision instrument."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assigning}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                {assigning ? 'Allocating...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationManagement;
