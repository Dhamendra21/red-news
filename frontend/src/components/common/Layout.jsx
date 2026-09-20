"use client";
import React, { useEffect } from 'react';

import Header from "./Header";
import Footer from "./Footer";
import BreakingNewsTicker from "../home/BreakingNewsTicker";
import { useDispatch } from 'react-redux';
import { fetchBreaking } from "@/store/slice/NewsSlice";
import { requestNotificationPermission } from "@/services/firebase";
import api from "@/services/api";

export default function Layout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBreaking());
    askNotificationPermission();
  }, [dispatch]);

  const askNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const token = await requestNotificationPermission();
      if (token) {
        try {
          await api.post('/notifications/subscribe', { token });
        } catch (e) {}
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC', fontFamily: "'Inter', 'Noto Sans Devanagari', system-ui, sans-serif" }}>
      {/* Breaking ticker sits at the very top — broadcast standard */}
      <BreakingNewsTicker />
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
