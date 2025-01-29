import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Doctor {
  // Personal Information
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  password: string;

  // Professional Details
  specialty: string;
  licenseNumber: string;
  education: string;
  hospitalAffiliation: string;
  experience: string;
  rating?: number;
  reviewCount?: number;

  // Location
  address: string;
  city: string;
  district: string;

  // Availability
  availableDays: string[];
  startTime: string;
  endTime: string;
  isAvailable: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;
}

interface DoctorState {
  doctors: Doctor[];
  selectedDr: Doctor | null;
  loading: boolean;
  error: string | null;
  patients: any[];
}

const initialState: DoctorState = {
  doctors: [],
  selectedDr: null,
  loading: false,
  error: null,
  patients: [],
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.doctors = action.payload;
    },
    setSelectedDoctor: (state, action: PayloadAction<Doctor>) => {
      state.selectedDr = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSelectedDoctor: (state) => {
      state.selectedDr = null;
    },
    setPatients: (state, action: PayloadAction<any[]>) => {
      state.patients = action.payload;
    },
  },
});

export const doctorActions = doctorSlice.actions;
export default doctorSlice.reducer;
