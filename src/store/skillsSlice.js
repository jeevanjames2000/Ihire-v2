// src/store/skillsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const skillsSlice = createSlice({
  name: "skills",
  initialState: {
    list: [], // list of added skills
  },
  reducers: {
    addSkill: (state, action) => {
      if (!state.list.includes(action.payload) && action.payload.trim() !== "") {
        state.list.push(action.payload);
      }
    },
    removeSkill: (state, action) => {
      state.list = state.list.filter((skill) => skill !== action.payload);
    },
    clearSkills: (state) => {
      state.list = [];
    },
  },
});

export const { addSkill, removeSkill, clearSkills } = skillsSlice.actions;
export default skillsSlice.reducer;
