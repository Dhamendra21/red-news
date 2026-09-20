import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "@/services/api";

export const fetchNews = createAsyncThunk('news/fetchNews', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/news', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchTrending = createAsyncThunk('news/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/news/trending', { params: { limit: 10 } });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchBreaking = createAsyncThunk('news/fetchBreaking', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/news/breaking');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchNewsBySlug = createAsyncThunk('news/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/news/${slug}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    list: [],
    trending: [],
    breaking: [],
    currentNews: null,
    total: 0,
    pages: 1,
    currentPage: 1,
    isLoading: false,
    error: null
  },
  reducers: {
    clearCurrentNews: (state) => { state.currentNews = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => { state.isLoading = true; })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => { state.trending = action.payload; })
      .addCase(fetchBreaking.fulfilled, (state, action) => { state.breaking = action.payload; })
      .addCase(fetchNewsBySlug.pending, (state) => { state.isLoading = true; })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentNews = action.payload;
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentNews } = newsSlice.actions;
export default newsSlice.reducer;
