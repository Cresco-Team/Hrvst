// Type definitions for the Hrvst application

export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Crop {
  id: number;
  category_id: number;
  name: string;
  low_price: number;
  high_price: number;
  harvest_weeks: number;
  image_path?: string;
  category?: Category;
  created_at?: string;
  updated_at?: string;
  // Computed attributes from model
  average_price?: number;
  price_range?: string;
}

export interface FarmerCrop {
  plant_id: number;
  farmer_id: number;
  crop_id: number;
  yield_kg?: string;
  planting_date?: string;
  harvesting_date?: string;
  planted_at: string;
  status: 'active' | 'harvested' | 'expired';
  created_at?: string;
  updated_at?: string;
  // Computed attributes
  expected_harvest_date?: string;
  crop?: Crop;
}

export interface Municipality {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Barangay {
  id: number;
  municipality_id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  isAdmin: boolean;
  isApproved: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Farmer {
  id: number;
  user_id: number;
  municipality_id: number;
  barangay_id: number;
  latitude?: number;
  longitude?: number;
  image_path?: string;
  user?: User;
  municipality?: Municipality;
  barangay?: Barangay;
  crops?: Crop[];
  created_at?: string;
  updated_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User | null;
  }
}