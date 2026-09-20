import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slice/authSlice";
import newsReducer from "./slice/NewsSlice";
import uiReducer from "./slice/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
