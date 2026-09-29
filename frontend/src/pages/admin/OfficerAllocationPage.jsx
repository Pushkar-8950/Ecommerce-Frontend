import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import {
  UserCheck,
  Building,
  Calendar,
  Clock,
  MapPin,
  Scale,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';

export const OfficerAllocationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [gatcs, setGatcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  // Form State
  const [assignedType, setAssignedType] = useState('LMO');
  const [assignedOfficerId, setAssignedOfficerId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledSlot, setScheduledSlot] = useState('10:00 AM - 01:00 PM');
  const [assignmentComments, setAssignmentComments] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, officersRes, gatcsRes] = await Promise.all([
        api.get('/applications'),
        api.get('/users/officers'),
        api.get('/users/gatcs'),
      ]);

      const allApps = appsRes.data.data || [];
      setApplications(allApps);
      setOfficers(officersRes.data.data || []);
      setGatcs(gatcsRes.data.data || []);

      // Check URL query param for specific case
      const searchParams = new URLSearchParams(location.search);
      const caseRef = searchParams.get('case');

      if (caseRef) {
        const found = allApps.find(
          (a) => a.applicationId === caseRef || a._id === caseRef
        );
        if (found) {
          selectApplication(found, officersRes.data.data || [], gatcsRes.data.data || []);
          return;
        }
      }

      // Default to first pending application (SUBMITTED or SCHEDULED)
      const pendingApp = allApps.find((a) => a.status === 'SUBMITTED') || allApps[0];
      if (pendingApp) {
        selectApplication(pendingApp, officersRes.data.data || [], gatcsRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load allocation data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const selectApplication = (app, officerList = officers, gatcList = gatcs) => {
    setSelectedApp(app);
    setAssignedType(app.assignedToType || 'LMO');

    // Auto-match local inspector based on applicant's district
    const appDistrict = app.owner?.district || '';
    const localOfficer = officerList.find(
      (o) => o.district && appDistrict && o.district.toLowerCase() === appDistrict.toLowerCase()
    );

    if (app.assignedOfficer?._id) {
      setAssignedOfficerId(app.assignedOfficer._id);
    } else if (localOfficer) {
      setAssignedOfficerId(localOfficer._id);
    } else if (officerList[0]?._id) {
      setAssignedOfficerId(officerList[0]._id);
    }

    setScheduledDate(
      app.scheduledDate
        ? new Date(app.scheduledDate).toISOString().split('T')[0]
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    setScheduledSlot(app.scheduledSlot || '10:00 AM - 01:00 PM');
    setAssignmentComments('');
    setSuccessMessage('');
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp || !assignedOfficerId || !scheduledDate) return;

    try {
      setAssigning(true);
      await api.post(`/applications/${selectedApp._id}/assign`, {
        assignedOfficerId,
        assignedToType: assignedType,
        scheduledDate,
        scheduledSlot,
        comments: assignmentComments,
      });

      // Broadcast real-time update to all tabs/windows
      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('metraverify_sync_channel');
        bc.postMessage({
          type: 'CASE_ASSIGNED',
          applicationId: selectedApp.applicationId,
          officerId: assignedOfficerId,
          timestamp: Date.now(),
        });
      }
      window.dispatchEvent(new CustomEvent('metraverify_sync'));

      setSuccessMessage(
        `Application ${selectedApp.applicationId} successfully forwarded and allocated to ${
          assignedType === 'LMO' ? 'Inspecting Officer' : 'GATC Laboratory'
        }!`
      );

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Assignment error', err);
    } finally {
      setAssigning(false);
    }
  };

  // Filter pending/submitted applications first
  const pendingCases = applications.filter((a) => {
    const s = searchFilter.toLowerCase();
    const matchesSearch =
      !searchFilter ||
      a.applicationId.toLowerCase().includes(s) ||
      a.owner?.organizationName?.toLowerCase().includes(s) ||
      a.owner?.fullName?.toLowerCase().includes(s) ||
      a.instrument?.instrumentId?.toLowerCase().includes(s);
    return matchesSearch;
  });

  // Calculate local inspector matching
  const appDistrict = selectedApp?.owner?.district || '';
  const matchingOfficers = officers.filter(
    (o) => o.district && appDistrict && o.district.toLowerCase() === appDistrict.toLowerCase()
  );
  const otherOfficers = officers.filter(
    (o) => !o.district || !appDistrict || o.district.toLowerCase() !== appDistrict.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Central Authority Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Central Authority Mandate (HQ Admin)
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-sans">
              Officer & Inspection Allocation Console
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              As the Central Authority, review incoming commercial verification requests and forward them to local jurisdiction inspectors or approved test laboratories for field inspection and stamping.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </Link>
            <Link
              to="/admin/applications"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <span>All Applications</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading Allocation System & Jurisdictional Officers...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Incoming Requests Queue</h3>
                  <p className="text-[11px] text-slate-500">Select application to assign officer</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-xs rounded-full border border-amber-200">
                  {applications.filter((a) => a.status === 'SUBMITTED').length} Pending
                </span>
              </div>

              {/* Search box */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by Case ID, Business..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* List of Applications */}
              <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                {pendingCases.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No matching applications found.
                  </div>
                ) : (
                  pendingCases.map((app) => {
                    const isSelected = selectedApp?._id === app._id;
                    const isSubmitted = app.status === 'SUBMITTED';

                    return (
                      <div
                        key={app._id}
                        onClick={() => selectApplication(app)}
                        className={`p-3 rounded-xl cursor-pointer transition-all pt-2.5 ${
                          isSelected
                            ? 'bg-blue-50/90 border-2 border-blue-500 shadow-sm'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono font-bold text-xs text-blue-700">
                            {app.applicationId}
                          </span>
                          <StatusBadge status={app.status} />
                        </div>
                        <span className="font-bold text-xs text-slate-800 block truncate">
                          {app.owner?.organizationName || app.owner?.fullName}
                        </span>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span className="truncate">{app.instrument?.instrumentType}</span>
                          <span className="font-medium text-slate-600 shrink-0">
                            {app.owner?.district || 'Delhi'}
                          </span>
                        </div>
                        {isSubmitted && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            <span>Needs Assignment</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Allocation Workbench (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedApp ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Workbench Top Bar */}
                <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Allocation Case
                      </span>
                      <span className="font-mono font-bold text-blue-700 text-sm">
                        {selectedApp.applicationId}
                      </span>
                      <StatusBadge status={selectedApp.status} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedApp.owner?.organizationName || selectedApp.owner?.fullName}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Preferred Date</span>
                    <span className="text-xs font-bold text-slate-800">
                      {new Date(selectedApp.preferredDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {successMessage && (
                  <div className="m-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">Assignment Successful!</span>
                      <span>{successMessage}</span>
                    </div>
                  </div>
                )}

                {/* Case Particulars Grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 bg-slate-50/30 text-xs">
                  {/* Left Specs */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-blue-700">
                      <Scale className="w-3.5 h-3.5" />
                      Instrument Details
                    </h4>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Type:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedApp.instrument?.instrumentType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Asset Ref:</span>
                        <span className="font-mono font-bold text-blue-600">
                          {selectedApp.instrument?.instrumentId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Serial No:</span>
                        <span className="font-mono text-slate-700">
                          {selectedApp.instrument?.serialNumber || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capacity / Model:</span>
                        <span className="text-slate-800 font-medium">
                          {selectedApp.instrument?.capacity} • {selectedApp.instrument?.model}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Facility */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-blue-700">
                      <MapPin className="w-3.5 h-3.5" />
                      Applicant Premise & Jurisdiction
                    </h4>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jurisdiction District:</span>
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          {selectedApp.owner?.district || 'Central Delhi'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">State:</span>
                        <span className="text-slate-800 font-medium">
                          {selectedApp.owner?.state || 'Delhi'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pincode:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          {selectedApp.owner?.pincode || '110001'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Premise Address:</span>
                        <span className="text-slate-700 truncate max-w-[200px]" title={selectedApp.owner?.address}>
                          {selectedApp.owner?.address || selectedApp.preferredLocation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Central Authority Assignment Form */}
                <form onSubmit={handleAssignSubmit} className="p-5 space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Assign Local Inspecting Officer / Testing Facility
                    </h3>
                    <p className="text-slate-500 text-[11px]">
                      Select the authorized enforcement authority based on facility location and instrument class.
                    </p>
                  </div>

                  {/* Authority Type Toggle */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Dispatch Target Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setAssignedType('LMO');
                          if (matchingOfficers.length > 0) {
                            setAssignedOfficerId(matchingOfficers[0]._id);
                          } else if (officers.length > 0) {
                            setAssignedOfficerId(officers[0]._id);
                          }
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-start gap-3 ${
                          assignedType === 'LMO'
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold">Legal Metrology Officer (LMO)</span>
                          <span className="text-[10px] font-normal text-slate-500">
                            Local jurisdictional field inspector for on-site stamping
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAssignedType('GATC');
                          if (gatcs.length > 0) {
                            setAssignedOfficerId(gatcs[0]._id);
                          }
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-start gap-3 ${
                          assignedType === 'GATC'
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Building className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold">Accredited Laboratory (GATC)</span>
                          <span className="text-[10px] font-normal text-slate-500">
                            Authorized government calibration & bench testing centre
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Local Inspector Matching Indicator */}
                  {assignedType === 'LMO' && matchingOfficers.length > 0 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Inspector Local Matching:</strong> Found {matchingOfficers.length} officer(s) stationed in applicant's district (<strong>{appDistrict}</strong>).
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 rounded text-emerald-800">
                        Geo-Matched
                      </span>
                    </div>
                  )}

                  {/* Select Officer Dropdown */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Choose {assignedType === 'LMO' ? 'Inspecting Officer' : 'GATC Facility'} *
                    </label>
                    <select
                      value={assignedOfficerId}
                      onChange={(e) => setAssignedOfficerId(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs font-medium"
                    >
                      {assignedType === 'LMO' ? (
                        <>
                          {matchingOfficers.length > 0 && (
                            <optgroup label={`🌟 Recommended Local Officers (${appDistrict})`}>
                              {matchingOfficers.map((off) => (
                                <option key={off._id} value={off._id}>
                                  ★ {off.fullName} - {off.designation || 'LMO'} ({off.district}, {off.state})
                                </option>
                              ))}
                            </optgroup>
                          )}
                          <optgroup label="Other Jurisdiction Officers">
                            {otherOfficers.map((off) => (
                              <option key={off._id} value={off._id}>
                                {off.fullName} - {off.designation || 'LMO'} ({off.district}, {off.state})
                              </option>
                            ))}
                          </optgroup>
                        </>
                      ) : (
                        gatcs.map((g) => (
                          <option key={g._id} value={g._id}>
                            {g.organizationName || g.fullName} - ({g.district}, {g.state})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Date & Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700">
                          Scheduled Inspection Date *
                        </label>
                        <div className="flex items-center gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 1);
                              setScheduledDate(d.toISOString().split('T')[0]);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            +Tomorrow
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 3);
                              setScheduledDate(d.toISOString().split('T')[0]);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            +3 Days
                          </button>
                        </div>
                      </div>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Verification Time Slot
                      </label>
                      <select
                        value={scheduledSlot}
                        onChange={(e) => setScheduledSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                      >
                        <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                        <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                        <option value="All Day Bench Test">All Day Bench Test</option>
                      </select>
                    </div>
                  </div>

                  {/* Administrative Directives */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      HQ Central Directives & Inspection Instructions
                    </label>
                    <textarea
                      rows="2"
                      value={assignmentComments}
                      onChange={(e) => setAssignmentComments(e.target.value)}
                      placeholder="e.g. Mandatory standard test mass verification Class M1 weights required for verification."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">
                      Forwarding will notify both the local officer and the commercial applicant immediately.
                    </span>
                    <button
                      type="submit"
                      disabled={assigning}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2 text-xs"
                    >
                      <Send className="w-4 h-4" />
                      {assigning ? 'Dispatching...' : 'Forward & Allocate to Local Officer'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
                Select an application from the queue to start allocation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerAllocationPage;
