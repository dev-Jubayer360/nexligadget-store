"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, Shield, ShieldOff } from 'lucide-react';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id, newRole) => {
    if (id === currentUser?._id) {
      alert("You cannot change your own role!");
      return;
    }
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Failed to update role', error);
      alert('Failed to update user role');
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      alert("You cannot delete yourself!");
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      console.error('Failed to delete user', error);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">Manage registered users and their roles</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold uppercase text-xs">
                          {u.name?.substring(0, 2)}
                        </div>
                        <div className="font-bold text-gray-900">{u.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role === 'user' ? (
                          <button onClick={() => handleUpdateRole(u._id, 'admin')} title="Promote to Admin" className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50" disabled={u._id === currentUser?._id}>
                            <Shield size={18} />
                          </button>
                        ) : (
                          <button onClick={() => handleUpdateRole(u._id, 'user')} title="Demote to User" className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-50" disabled={u._id === currentUser?._id}>
                            <ShieldOff size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(u._id)} title="Delete User" className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50" disabled={u._id === currentUser?._id}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
