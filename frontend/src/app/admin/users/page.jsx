"use client";
// AdminUsers.js
import React, { useEffect, useState } from 'react';
import api from "@/services/api";
import toast from 'react-hot-toast';
import { Users } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data.data)).catch(() => {});
  }, []);

  const changeRole = async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    toast.success('भूमिका बदली गई');
    api.get('/admin/users').then(({ data }) => setUsers(data.data));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Users size={28} /> उपयोगकर्ता प्रबंधन</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">नाम</th>
              <th className="text-left px-4 py-3">ईमेल</th>
              <th className="text-left px-4 py-3">भूमिका</th>
              <th className="text-left px-4 py-3">कार्य</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs outline-none">
                    {['reader','reporter','editor','admin'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
