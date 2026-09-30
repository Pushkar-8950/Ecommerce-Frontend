import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scale, ArrowRight, Building, MapPin, Mail, Phone, Lock, User } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'BUSINESS_USER',
    organizationName: '',
    address: '',
    state: 'Delhi',
    district: 'Central Delhi',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectingLoc, setDetectingLoc] = useState(false);

  const statesAndDistricts = {
    Delhi: ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Karnal', 'Ambala', 'Hisar'],
    'Uttar Pradesh': ['Lucknow', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Kanpur', 'Agra'],
    Rajasthan: ['Jaipur', 'Alwar', 'Jodhpur', 'Kota', 'Udaipur'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData((prev) => ({
        ...prev,
        state: value,
        district: statesAndDistricts[value] ? statesAndDistricts[value][0] : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAutoDetectLocation = () => {
    setDetectingLoc(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For SIH Demo: In a real app we would reverse geocode the lat/lng.
          // Here we mock a successful detection to one of our available regions.
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              state: 'Delhi',
              district: 'South Delhi',
              address: 'Okhla Industrial Estate Phase 3',
              pincode: '110020'
            }));
            setDetectingLoc(false);
          }, 800);
        },
        (err) => {
          console.warn(err);
          setDetectingLoc(false);
          setError('Location access denied or unavailable. Please fill manually.');
        }
      );
    } else {
      setDetectingLoc(false);
      setError('Geolocation not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/business/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please review inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8 sm:py-12 px-3 sm:px-8">
      <div className="max-w-xl w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Stakeholder Registration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Register your commercial enterprise or facility on MetraVerify
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Authorized Signatory *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enterprise / Organization Name *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Kumar Agro Depot Ltd"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@enterprise.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Contact Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 pt-4 mt-2">
              <h3 className="text-xs font-bold text-slate-800">Location Details</h3>
              <button
                type="button"
                onClick={handleAutoDetectLocation}
                disabled={detectingLoc}
                className="self-start sm:self-auto text-[10px] font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <MapPin className="w-3.5 h-3.5" />
                {detectingLoc ? 'Detecting...' : 'Auto-Detect Location'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State / Union Territory *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {Object.keys(statesAndDistricts).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jurisdiction District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {(statesAndDistricts[formData.state] || []).map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commercial Facility Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Plot/Unit No., Industrial Area, Street"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 110020"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-10 mt-0.5"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used for local inspector matching
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Account...' : 'Complete Stakeholder Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link
              to="/login"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              Sign in to portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
