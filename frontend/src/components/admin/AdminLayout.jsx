"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "@/store/slice/authSlice";
import { LayoutDashboard, BarChart3, Newspaper, SquarePen, Inbox, Megaphone, Users, User, LogOut, ChevronLeft, ChevronRight, Link as LinkIcon, FolderTree } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, exact: true },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={20} />, badge: 'नया' },
  { path: '/admin/news', label: 'News', icon: <Newspaper size={20} /> },
  { path: '/admin/news/create', label: 'Create News', icon: <SquarePen size={20} /> },
  { path: '/admin/comments', label: 'Comments', icon: <Inbox size={20} /> },
  { path: '/admin/ads', label: 'Ads', icon: <Megaphone size={20} /> },
  { path: '/admin/reader-submissions', label: 'Submissions', icon: <FolderTree size={20} /> },
  { path: '/admin/users', label: 'Users', icon: <Users size={20} />, adminOnly: true },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { pathname } = { pathname: usePathname() };
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { user } = useSelector(state => state?.auth || {});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300 flex flex-col flex-shrink-0`}>
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">RN</div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wider text-white">RED NEWS BHARAT</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Portal</span>
            </div>
          )}
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            const active = item.exact ? pathname === item.path : pathname.startsWith(item.path) && item.path !== '/admin';
            return (
              <Link key={item.path} href={item.path} title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${active ? 'bg-slate-800 text-white border-l-4 border-red-600 font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                <span className={`text-base flex-shrink-0 ${active ? 'text-red-500' : ''}`}>{item.icon}</span>
                {sidebarOpen && <span className="text-sm flex-1">{item.label}</span>}
                {sidebarOpen && item.badge && <span className="text-[10px] uppercase tracking-wider bg-red-600/20 text-red-500 border border-red-600/30 px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-800">
          {sidebarOpen && <div className="mb-3 px-2"><p className="text-xs text-slate-300 font-medium truncate">{user?.name}</p><p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</p></div>}
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm px-2 py-1.5 w-full rounded-lg hover:bg-slate-800/50 transition-colors">
            <LogOut size={16} />{sidebarOpen && 'Log Out '}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700 text-xl">{sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}</button>
          <div className="flex items-center gap-4">
            <Link href="/admin/analytics" className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"><BarChart3 size={16} /> Analytics</Link>
            <Link href="/" target="_blank" className="text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"><LinkIcon size={16} /> Live Site</Link>
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-sm font-bold">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
