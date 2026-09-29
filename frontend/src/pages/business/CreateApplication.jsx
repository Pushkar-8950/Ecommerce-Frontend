import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { FileCheck, ArrowLeft, ArrowRight, Scale, Calendar, MapPin, FileText } from 'lucide-react';

export const CreateApplication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [instruments, setInstruments] = useState([]);
  const [loadingInstruments, setLoadingInstruments] = useState(true);

  const [formData, setFormData] = useState({
    instrumentId: searchParams.get('instrumentId') || '',
    applicationType: searchParams.get('type') || 'NEW_VERIFICATION',
    preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferredLocation: 'On-site Commercial Premise',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInstruments = async () => {
      try {
        setLoadingInstruments(true);
        const res = await api.get('/instruments');
        setInstruments(res.data.data || []);
        if (!formData.instrumentId && res.data.data?.length > 0) {
          setFormData((prev) => ({ ...prev, instrumentId: res.data.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load instruments', err);
      } finally {
        setLoadingInstruments(false);
      }
    };
    loadInstruments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.instrumentId || !formData.preferredDate) {
      setError('Please select an instrument and preferred inspection date.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/applications', formData);
      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('metraverify_sync_channel');
        bc.postMessage({ type: 'APPLICATION_CREATED', timestamp: Date.now() });
      }
      window.dispatchEvent(new CustomEvent('metraverify_sync'));
      navigate(`/business/applications/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedInst = instruments.find((i) => i._id === formData.instrumentId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/business/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
        <span className="text-xs font-semibold text-slate-400">Rule 14 Verification Request</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Apply for Instrument Verification / Re-verification
            </h1>
            <p className="text-xs text-slate-500">
              Schedule an official inspection with the Legal Metrology Officer or accredited testing facility.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Instrument */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Instrument from Your Registry *
            </label>
            {loadingInstruments ? (
              <div className="text-xs text-slate-400 py-2">Loading your registered instruments...</div>
            ) : instruments.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs">
                <span className="text-slate-600 block mb-2">No registered instruments found in your account.</span>
                <Link
                  to="/business/instruments/new"
                  className="inline-block px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Register an Instrument First
                </Link>
              </div>
            ) : (
              <select
                name="instrumentId"
                value={formData.instrumentId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {instruments.map((inst) => (
                  <option key={inst._id} value={inst._id}>
                    {inst.instrumentId} - {inst.instrumentType} ({inst.model}) - S/N: {inst.serialNumber} [{inst.status}]
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Instrument Summary Card */}
          {selectedInst && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{selectedInst.instrumentType}</span>
                <span className="font-mono text-blue-600 font-semibold">{selectedInst.instrumentId}</span>
              </div>
              <div className="text-slate-500 text-[11px] grid grid-cols-2 gap-2 mt-1">
                <span>Make: {selectedInst.manufacturer} ({selectedInst.model})</span>
                <span>Capacity: {selectedInst.capacity}</span>
                <span>Class: {selectedInst.accuracyClass}</span>
                <span>Premises: {selectedInst.locationAddress}</span>
              </div>
            </div>
          )}

          {/* Application Type & Preferred Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Type *
              </label>
              <select
                name="applicationType"
                value={formData.applicationType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="NEW_VERIFICATION">New Verification (First-time stamping)</option>
                <option value="RE_VERIFICATION">Re-verification (Annual / Periodic renewal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Inspection Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inspection Location Type
            </label>
            <select
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="On-site Commercial Premise">On-site Commercial Premise (Inspector visits site)</option>
              <option value="Legal Metrology Standards Laboratory">Legal Metrology Standards Laboratory</option>
              <option value="Government Approved Test Centre (GATC)">Government Approved Test Centre (GATC)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Applicant Notes / Special Instructions
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Weighbridge requires pit cleaning verification prior to morning slot; site contact person phone number."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/business/applications"
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || instruments.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApplication;
