export type GarmentCategory = 'top' | 'bottom' | 'outerwear' | 'dress' | 'shoes' | 'accessory';

export type GarmentStatus = 'active' | 'donated' | 'listed_for_sale';

export interface UserProfile {
  id: string;
  display_name: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  timezone: string;
  onboarded: boolean;
  created_at: string;
}

export interface Garment {
  id: string;
  user_id: string;
  name: string;
  category: GarmentCategory;
  colour: string | null;
  price: number;
  photo_path: string;
  status: GarmentStatus;
  created_at: string;
}

export interface GarmentStats {
  garment_id: string;
  wear_count: number;
  last_worn: string | null;
  cost_per_wear: number;
  worn_in_last_7_days: boolean;
}

export interface WearLog {
  id: string;
  garment_id: string;
  user_id: string;
  worn_on: string; // YYYY-MM-DD
  created_at: string;
}

export interface BadgeDefinition {
  key: string;
  name: string;
  description: string;
  rule: string;
  icon: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_key: string;
  earned_at: string;
}

export interface PassOnRequest {
  id: string;
  garment_id: string;
  user_id: string;
  type: 'donate' | 'sell';
  ngo_id?: string | null;
  resale_price?: number | null;
  note?: string;
  created_at: string;
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last7Days: { date: string; logged: boolean; dayLabel: string }[];
}

export interface NGO {
  id: string;
  name: string;
  tagline: string;
  focus: string;
  location: string;
}
