import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;