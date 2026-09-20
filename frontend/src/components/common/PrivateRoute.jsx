"use client";
import React from 'react';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children, requiredRole }) {
  const { token, user } = useSelector(state => state?.auth || {});
  const location = { pathname: usePathname() };

  // Token नहीं है → login पर redirect
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Role check
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}