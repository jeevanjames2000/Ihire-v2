// lib/redux/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { redirect } from 'next/navigation'; 

const initialState = {
  searchTerm: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
    },
  },
});

export const { setSearchTerm, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
