"use client";
import React, { useEffect, useState } from 'react';
import api from "@/services/api";
import toast from 'react-hot-toast';
import { Youtube, Trash2, Plus, Film } from 'lucide-react';

export default function AdminWebStories() {
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', youtubeUrl: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchStories(); }, []);

  const fetchStories = () => {
    api.get('/web-stories').then(({ data }) => setStories(data.data)).catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/web-stories', form);
      toast.success('वेब स्टोरी जोड़ी गई');
      setShowForm(false);
      setForm({ title: '', youtubeUrl: '' });
      fetchStories();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'वेब स्टोरी जोड़ने में समस्या');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('क्या आप वाकई इस स्टोरी को हटाना चाहते हैं?')) return;
    try {
      await api.delete(`/web-stories/${id}`);
      toast.success('वेब स्टोरी हटा दी गई');
      fetchStories();
    } catch (err) {
      toast.error('स्टोरी हटाने में समस्या');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <Film className="text-red-600" /> वेब स्टोरीज (Web Stories)
        </h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
          <Plus size={18} /> {showForm ? 'रद्द करें' : 'नई स्टोरी जोड़ें'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 mb-8 max-w-2xl shadow-sm">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">नई वेब स्टोरी जोड़ें</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">शीर्षक (Title)</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-red-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">YouTube Shorts Link</label>
              <input type="url" value={form.youtubeUrl} onChange={e => setForm({...form, youtubeUrl: e.target.value})}
                placeholder="https://youtube.com/shorts/..."
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-red-500" required />
            </div>
            
            <button type="submit" disabled={isLoading}
              className="mt-2 bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors disabled:opacity-50">
              {isLoading ? 'जोड़ रहा है...' : 'स्टोरी सेव करें'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {stories.map(story => (
          <div key={story._id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
            <div className="aspect-[9/16] relative bg-slate-100">
              <img src={story.thumbnailUrl} alt={story.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                <p className="text-white text-xs font-bold line-clamp-3">{story.title}</p>
              </div>
            </div>
            
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(story._id)} className="bg-white/90 p-1.5 rounded-full text-red-600 hover:bg-red-50 shadow-sm">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {stories.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            कोई वेब स्टोरी नहीं मिली। नई स्टोरी जोड़ें।
          </div>
        )}
      </div>
    </div>
  );
}
