"use client";
// AdminLogin.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { login } from "@/store/slice/authSlice";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { isLoading, error } = useSelector(state => state?.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (!result.error) navigate.push('/admin');
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <img src="/logo.webp" alt="RED NEWS" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-red-800" style={{ fontFamily: 'serif' }}>RED NEWS </h1>
          <p className="text-gray-500 text-sm mt-1">संपादक पैनल में लॉगिन करें</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ईमेल</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-red-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {isLoading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
          </button>
        </form>
      </div>
    </div>
  );
}
