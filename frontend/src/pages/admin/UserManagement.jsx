import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Users, Search, Shield, Building, User, CheckCircle, Ban } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/users', { params });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const toggleUserStatus = async (user) => {
    try {
      await api.patch(`/users/${user._id}`, { isActive: !user.isActive });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const getRolePill = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">HQ ADMIN</span>;
      case 'LMO_OFFICER':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">LMO OFFICER</span>;
      case 'GATC':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">GATC LAB</span>;
      default:
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">BUSINESS</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Stakeholder & User Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Directory of registered commercial businesses, inspecting officers, and GATC test centres.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, organization..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="">All Roles</option>
          <option value="BUSINESS_USER">Business Users</option>
          <option value="LMO_OFFICER">Legal Metrology Officers</option>
          <option value="GATC">GATC Test Centres</option>
          <option value="ADMIN">HQ Administrators</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading users directory...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Stakeholder Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Organization / Department</th>
                  <th className="py-3 px-4">Email & Phone</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {u.fullName}
                    </td>
                    <td className="py-3 px-4">
                      {getRolePill(u.role)}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="block font-medium">{u.organizationName || u.department || 'N/A'}</span>
                      {u.designation && <span className="text-[10px] text-slate-400 block">{u.designation}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="block font-mono text-[11px]">{u.email}</span>
                      <span className="block text-[11px] text-slate-400">{u.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {u.district}, {u.state}
                    </td>
                    <td className="py-3 px-4">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-semibold">
                          <Ban className="w-3.5 h-3.5 text-rose-600" />
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleUserStatus(u)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
