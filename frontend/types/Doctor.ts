export default interface Doctor {
  // Personal Information
  uid: string;
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
  coords: {
    lat: number;
    lng: number;
  };

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
