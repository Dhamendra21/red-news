import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    searchOpen: false,
    notificationPermission: 'default'
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar: (state) => { state.sidebarOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    setNotificationPermission: (state, action) => { state.notificationPermission = action.payload; }
  }
});

export const { toggleSidebar, closeSidebar, toggleSearch, setNotificationPermission } = uiSlice.actions;
export default uiSlice.reducer;
