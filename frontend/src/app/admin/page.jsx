"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import api from "@/services/api";
import { LayoutDashboard, FileText, Calendar, Users, Eye, Flame, AlertCircle, MessageSquare, Clock, ClipboardList, PlusCircle, Megaphone, FolderTree, Image, SlidersHorizontal, FolderPlus } from 'lucide-react';

const StatCard = ({ label, value, icon, link }) => (
  <Link href={link || '#'} className="block hover:-translate-y-0.5 transition-transform">
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className="bg-red-50 text-red-600 p-2.5 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value ?? '...'}</div>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, newsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/news?limit=5&status=published'),
        ]);
        setStats(statsRes.data.data);
        setRecentNews(newsRes.data.data || []);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e53e3e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <LayoutDashboard className="text-red-600" size={28} /> Admin Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="कुल खबरें"       value={stats?.totalNews}      icon={<FileText size={24} strokeWidth={1.5} />} link="/admin/news" />
        <StatCard label="आज की खबरें"     value={stats?.todayNews}      icon={<Clock size={24} strokeWidth={1.5} />} link="/admin/news" />
        <StatCard label="कुल उपयोगकर्ता" value={stats?.totalUsers}     icon={<Users size={24} strokeWidth={1.5} />} link="/admin/users" />
        <StatCard label="कुल व्यूज़"      value={stats?.totalViews}     icon={<Eye size={24} strokeWidth={1.5} />} link="#" />
        <StatCard label="ट्रेंडिंग खबरें" value={stats?.trendingNews}   icon={<Flame size={24} strokeWidth={1.5} />} link="/admin/news" />
        <StatCard label="ब्रेकिंग न्यूज़" value={stats?.breakingNews}   icon={<AlertCircle size={24} strokeWidth={1.5} />} link="/admin/news" />
        <StatCard label="पेंडिंग कमेंट"  value={stats?.pendingComments} icon={<MessageSquare size={24} strokeWidth={1.5} />} link="/admin/comments" />
        <StatCard label="इस हफ्ते"        value={stats?.weekNews}        icon={<Calendar size={24} strokeWidth={1.5} />} link="/admin/news" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Recent News Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-base font-bold text-slate-900 m-0 flex items-center gap-2">
              <ClipboardList size={20} className="text-slate-400" /> हाल की खबरें
            </h2>
            <Link href="/admin/news" className="text-xs font-semibold text-red-600 hover:text-red-700">सभी देखें →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 text-[10px] font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3">शीर्षक</th>
                  <th className="px-5 py-3">श्रेणी</th>
                  <th className="px-5 py-3 text-right">व्यूज़</th>
                  <th className="px-5 py-3 text-center">स्थिति</th>
                  <th className="px-5 py-3 text-right">तारीख</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentNews.map((news) => (
                  <tr key={news._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-3">
                      <p className="m-0 text-sm font-semibold text-slate-800 line-clamp-1 max-w-xs group-hover:text-red-600 transition-colors">
                        {news.title}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-1 rounded-md font-medium">
                        {news.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500 font-medium text-right">
                      {news.views || 0}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`${news.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'} border px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                        {news.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 text-right whitespace-nowrap">
                      {new Date(news.publishedAt || news.createdAt).toLocaleDateString('hi-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/admin/news/create" className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-center gap-2 transition-colors">
                <PlusCircle size={18} /> नई खबर लिखें
              </Link>
              <Link href="/admin/news" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-lg px-4 py-2.5 font-medium flex items-center gap-2 transition-colors">
                <FolderPlus size={18} className="text-slate-400" /> सभी खबरें
              </Link>
              <Link href="/admin/ads" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-lg px-4 py-2.5 font-medium flex items-center gap-2 transition-colors">
                <Image size={18} className="text-slate-400" /> विज्ञापन प्रबंध
              </Link>
              <Link href="/admin/analytics" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-lg px-4 py-2.5 font-medium flex items-center gap-2 transition-colors">
                <SlidersHorizontal size={18} className="text-slate-400" /> Analytics
              </Link>
            </div>
          </div>

          {/* Category breakdown */}
          {stats?.categoryBreakdown && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <FolderTree size={18} className="text-slate-400" /> श्रेणी अनुसार
              </h3>
              <div className="flex flex-col">
                {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-sm">
                    <span className="text-slate-600 font-medium">{cat}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}