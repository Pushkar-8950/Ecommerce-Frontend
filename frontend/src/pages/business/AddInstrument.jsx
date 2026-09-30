import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { Scale, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AddInstrument = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    instrumentType: 'Electronic Weighing Instrument',
    category: 'Commercial',
    manufacturer: '',
    model: '',
    serialNumber: '',
    capacity: '',
    accuracyClass: 'Class III (Medium)',
    locationAddress: '',
    state: 'Delhi',
    district: 'Central Delhi',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const instrumentTypes = [
    'Electronic Weighing Instrument',
    'Electronic Weighbridge',
    'Platform Scale',
    'Counter Scale',
    'Precision Gold Balance',
    'Electronic Carat Balance',
    'Fuel Dispenser (Petrol / MS)',
    'Fuel Dispenser (High Speed Diesel)',
    'Industrial Coriolis Flow Meter',
    'Automatic Gravimetric Filling Instrument',
    'Non-automatic Weighing Instrument',
    'Spring Balance / Crane Scale',
  ];

  const categories = [
    'Commercial',
    'Industrial',
    'Petroleum',
    'Retail',
    'Healthcare',
    'Jewellery / Precision',
  ];

  const accuracyClasses = [
    'Class I (Special)',
    'Class II (High)',
    'Class III (Medium)',
    'Class IV (Ordinary)',
  ];

  const states = ['Delhi', 'Haryana', 'Uttar Pradesh', 'Rajasthan'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.manufacturer || !formData.model || !formData.serialNumber || !formData.capacity) {
      setError('Please fill in all mandatory specifications.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.post('/instruments', formData);
      navigate(`/business/instruments/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register instrument.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Link
          to="/business/instruments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instruments</span>
        </Link>
        <span className="text-xs font-semibold text-slate-400">Section 24 Compliance Form</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Register New Weighing / Measuring Instrument
            </h1>
            <p className="text-xs text-slate-500">
              Enter official manufacturer specs and location to onboard into the National Registry.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instrument Type *
              </label>
              <select
                name="instrumentType"
                value={formData.instrumentType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {instrumentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model & Make */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Manufacturer / Brand *
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g. Essae-Teraoka, Avery"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Number *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. WB-60T Pitless"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Serial Number *
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g. ESS-2026-9921"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Capacity & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capacity / Range *
              </label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g. 60 Metric Tonnes x 10kg, 30kg x 2g"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Accuracy Class *
              </label>
              <select
                name="accuracyClass"
                value={formData.accuracyClass}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {accuracyClasses.map((ac) => (
                  <option key={ac} value={ac}>
                    {ac}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Installation Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District *
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Gurugram, Central Delhi"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase / Commissioning Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Premises / Facility Location Address *
            </label>
            <textarea
              name="locationAddress"
              rows="2"
              value={formData.locationAddress}
              onChange={handleChange}
              placeholder="e.g. Weighbridge Bay 2, Logistic Hub, Sector 18"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/business/instruments"
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Registering...' : 'Register Instrument'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstrument;
