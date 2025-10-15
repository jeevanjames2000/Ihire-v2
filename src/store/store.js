import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice.js";
import authReducer from '../store/authSlice.js';
import searchReducer from "../store/SearchSlice.js";
const store = configureStore({
  reducer: {
    auth:authReducer,
    user: userReducer,
                   search: searchReducer,
  },
});
export default store;
