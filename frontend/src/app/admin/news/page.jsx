"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Newspaper, Flame, Edit, Trash2, Eye, AlertCircle, Image as ImageIcon, PlusCircle } from 'lucide-react';

function AdminNewsContent() {
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || '';

  const fetchNews = () => {
    setIsLoading(true);
    api.get('/news', { params: { page, limit: 20, status: statusFilter || undefined } })
      .then(({ data }) => { setNews(data.data); setTotal(data.total); })
      .catch(() => toast.error('समाचार लोड नहीं हो सका'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('क्या आप इस समाचार को हटाना चाहते हैं?')) return;
    try {
      await api.delete(`/news/${id}`);
      toast.success('समाचार हटाया गया');
      fetchNews();
    } catch { toast.error('हटाने में समस्या हुई'); }
  };

  const toggleTrending = async (id) => {
    try {
      await api.patch(`/news/${id}/trending`);
      fetchNews();
    } catch { toast.error('अपडेट विफल'); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Newspaper className="text-red-600" size={28} /> सभी समाचार <span className="text-sm font-medium text-slate-500">({total})</span>
        </h1>
        <Link href="/admin/news/create" className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-colors">
          <PlusCircle size={18} /> नई खबर
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/90 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-4">शीर्षक</th>
                  <th className="text-left px-5 py-4 hidden md:table-cell">वर्ग</th>
                  <th className="text-center px-5 py-4 hidden md:table-cell">स्थिति</th>
                  <th className="text-right px-5 py-4 hidden lg:table-cell">दृश्य</th>
                  <th className="text-right px-5 py-4 hidden lg:table-cell">तारीख</th>
                  <th className="text-right px-5 py-4">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {news.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {item.images?.[0]?.url ? (
                            <img 
                              src={item.images[0].url} 
                              alt="Thumbnail" 
                              className="w-16 h-11 object-cover rounded-md border border-slate-200" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="w-16 h-11 bg-slate-100 rounded-md border border-slate-200 shrink-0 flex items-center justify-center text-slate-400" 
                            style={{ display: item.images?.[0]?.url ? 'none' : 'flex' }}
                          >
                            <ImageIcon size={18} />
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <p className="font-semibold text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors max-w-sm">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            {item.isTrending && (
                              <span className="text-[10px] uppercase tracking-wider font-bold text-red-500 flex items-center gap-1">
                                <Flame size={10} /> ट्रेंडिंग
                              </span>
                            )}
                            {item.isBreaking && (
                              <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 flex items-center gap-1">
                                <AlertCircle size={10} /> ब्रेकिंग
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-1 rounded-md font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {item.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-right text-slate-500 font-medium">
                      <div className="flex items-center justify-end gap-1.5">
                        <Eye size={14} className="text-slate-400" /> {item.views || 0}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-right text-slate-400 text-xs whitespace-nowrap">
                      {dayjs(item.createdAt).format('DD/MM/YY')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/news/${item.slug || item._id}`} 
                          target="_blank" 
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" 
                          title="देखें (View Live)"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/news/edit/${item._id}`} 
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors" 
                          title="संपादित करें (Edit)"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => toggleTrending(item._id)} 
                          className={`p-1.5 rounded-md transition-colors ${item.isTrending ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'}`} 
                          title="ट्रेंडिंग टॉगल (Toggle Trending)"
                        >
                          <Flame size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                          title="हटाएं (Delete)"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {news.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
                <Newspaper size={48} className="opacity-20" />
                <p>कोई समाचार नहीं मिला</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminNewsList() {
  return (
    <React.Suspense fallback={
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
      </div>
    }>
      <AdminNewsContent />
    </React.Suspense>
  );
}
