"use client";

import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from "@/store/store";
import { useEffect } from 'react';
import { loadUser } from "@/store/slice/authSlice";

export function Providers({ children }) {
  console.log("==== REDUX STORE ====", store);
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      store.dispatch(loadUser());
    }
  }, []);

  return (
    <Provider store={store}>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        {children}
    </Provider>
  );
}
