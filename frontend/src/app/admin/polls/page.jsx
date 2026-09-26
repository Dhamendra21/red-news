"use client";
import React, { useEffect, useState } from 'react';
import api from "@/services/api";
import toast from 'react-hot-toast';
import { BarChart2, Trash2, Plus, X } from 'lucide-react';

export default function AdminPolls() {
  const [poll, setPoll] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    question: '', 
    options: ['हाँ', 'नहीं', 'कह नहीं सकते'] 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchPoll(); }, []);

  const fetchPoll = () => {
    api.get('/polls').then(({ data }) => setPoll(data.data)).catch(() => {});
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const addOption = () => {
    setForm({ ...form, options: [...form.options, ''] });
  };

  const removeOption = (index) => {
    const newOptions = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Filter empty options
    const finalOptions = form.options.filter(opt => opt.trim() !== '');
    try {
      await api.post('/polls', { question: form.question, options: finalOptions });
      toast.success('पोल जोड़ा गया');
      setShowForm(false);
      setForm({ question: '', options: ['हाँ', 'नहीं', 'कह नहीं सकते'] });
      fetchPoll();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'पोल जोड़ने में समस्या');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('क्या आप वाकई इस पोल को हटाना चाहते हैं?')) return;
    try {
      await api.delete(`/polls/${id}`);
      toast.success('पोल हटा दिया गया');
      fetchPoll();
    } catch (err) {
      toast.error('पोल हटाने में समस्या');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <BarChart2 className="text-red-600" /> आज का बड़ा सवाल (Daily Poll)
        </h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
          <Plus size={18} /> {showForm ? 'रद्द करें' : 'नया पोल बनाएं'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 mb-8 max-w-2xl shadow-sm">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">नया पोल जोड़ें</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">सवाल (Question)</label>
              <textarea value={form.question} onChange={e => setForm({...form, question: e.target.value})}
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-red-500 min-h-[80px]" required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">विकल्प (Options)</label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input type="text" value={opt} onChange={e => handleOptionChange(i, e.target.value)}
                    className="flex-1 border border-slate-300 p-2 rounded-lg outline-none focus:border-red-500" required />
                  {form.options.length > 2 && (
                    <button type="button" onClick={() => removeOption(i)} className="text-slate-400 hover:text-red-600">
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addOption} className="text-sm text-red-600 font-semibold hover:underline mt-1">
                + एक और विकल्प जोड़ें
              </button>
            </div>
            
            <button type="submit" disabled={isLoading}
              className="mt-4 bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors disabled:opacity-50">
              {isLoading ? 'सेव कर रहा है...' : 'पोल पब्लिश करें'}
            </button>
          </div>
        </form>
      )}

      {poll ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded mb-2">ACTIVE</span>
              <h2 className="text-xl font-bold text-slate-800">{poll.question}</h2>
            </div>
            <button onClick={() => handleDelete(poll._id)} className="text-slate-400 hover:text-red-600 p-1">
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            {poll.options.map(opt => {
              const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
              return (
                <div key={opt._id} className="relative w-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-between p-3">
                  <div className="absolute left-0 top-0 bottom-0 bg-red-100 transition-all" style={{ width: `${percent}%` }} />
                  <span className="relative z-10 font-semibold text-slate-700">{opt.label}</span>
                  <div className="relative z-10 text-sm font-bold text-slate-600">
                    {opt.votes} वोट्स <span className="text-slate-400 font-normal">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm font-semibold text-slate-500">
            कुल वोट्स: {poll.totalVotes}
          </div>
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300 max-w-2xl">
          कोई सक्रिय पोल नहीं मिला। नया पोल बनाएं।
        </div>
      )}
    </div>
  );
}
