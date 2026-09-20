"use client";
import React, { useEffect, useState } from 'react';
import api from "@/services/api";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { MessageCircle, CheckCircle, Trash2, PartyPopper } from 'lucide-react';

export default function AdminComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => { fetchComments(); }, []);

  const fetchComments = () => {
    api.get('/admin/pending-comments').then(({ data }) => setComments(data.data)).catch(() => {});
  };

  const approve = async (id) => {
    await api.patch(`/comments/${id}/approve`);
    toast.success('टिप्पणी स्वीकृत हुई');
    fetchComments();
  };

  const remove = async (id) => {
    await api.delete(`/comments/${id}`);
    toast.success('टिप्पणी हटाई गई');
    fetchComments();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MessageCircle size={28} /> टिप्पणी प्रबंधन ({comments.length} लंबित)</h1>
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c._id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">{dayjs(c.createdAt).fromNow()}</p>
                {c.news && <p className="text-xs text-green-600 mt-1">खबर: {c.news.title}</p>}
                <p className="text-sm text-gray-700 mt-2">{c.comment}</p>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button onClick={() => approve(c._id)} className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs hover:bg-green-200 flex items-center gap-1"><CheckCircle size={12} /> स्वीकृत</button>
                <button onClick={() => remove(c._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 flex items-center gap-1"><Trash2 size={12} /> हटाएं</button>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-center text-gray-400 py-10 flex items-center justify-center gap-2">कोई लंबित टिप्पणी नहीं <PartyPopper size={20} /></p>}
      </div>
    </div>
  );
}
