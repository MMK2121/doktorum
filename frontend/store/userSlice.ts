import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string | null;
  email: string | null;
  token: string | null;
  name: string | null;
  appointment: Array<any> | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
  name: null,
  token: null,
  appointment: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isAuthenticated: true, error: null };
    },
    setAuthenticated: (state) => {
      state.isAuthenticated = !state.isAuthenticated;
    },
    clearUser: (state) => {
      return { ...initialState };
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAppointment: (state, action: PayloadAction<any>) => {
      state.appointment?.push(action.payload);
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
