"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import api from "@/services/api";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Inbox, Edit, CheckCircle, X } from 'lucide-react';

export default function AdminReaderSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    api.get('/admin/reader-submissions').then(({ data }) => setSubmissions(data.data)).catch(() => {});
  }, []);

  const approve = async (id) => {
    await api.put(`/news/${id}`, { status: 'published' });
    toast.success('खबर प्रकाशित हुई');
    setSubmissions(prev => prev.filter(s => s._id !== id));
  };

  const reject = async (id) => {
    await api.delete(`/news/${id}`);
    toast.success('खबर अस्वीकृत हुई');
    setSubmissions(prev => prev.filter(s => s._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Inbox size={28} /> पाठकों की खबरें ({submissions.length})</h1>
      <div className="space-y-4">
        {submissions.map(s => (
          <div key={s._id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-1">पाठक: {s.readerName} • {dayjs(s.createdAt).fromNow()}</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{s.summary}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Link href={`/admin/news/edit/${s._id}`} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200 flex items-center gap-1"><Edit size={12} /> संपादित</Link>
                <button onClick={() => approve(s._id)} className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs hover:bg-green-200 flex items-center gap-1"><CheckCircle size={12} /> प्रकाशित</button>
                <button onClick={() => reject(s._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 flex items-center gap-1"><X size={12} /> अस्वीकृत</button>
              </div>
            </div>
          </div>
        ))}
        {submissions.length === 0 && <p className="text-center text-gray-400 py-10">कोई नई पाठक खबर नहीं</p>}
      </div>
    </div>
  );
}
