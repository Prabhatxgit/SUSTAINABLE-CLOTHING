import {
  Garment,
  GarmentStats,
  PassOnRequest,
  StreakInfo,
  UserBadge,
  UserProfile,
  WearLog,
} from '../types';
import { BADGE_DEFINITIONS } from './badges';
import {
  DEMO_USER,
  getDateOffset,
  getInitialDemoBadges,
  getInitialDemoGarments,
  getInitialDemoWearLogs,
  getTodayDateString,
} from './seed';

const STORAGE_KEY_USER = 'wearmore_user';
const STORAGE_KEY_GARMENTS = 'wearmore_garments';
const STORAGE_KEY_WEARS = 'wearmore_wears';
const STORAGE_KEY_BADGES = 'wearmore_badges';
const STORAGE_KEY_PASSON = 'wearmore_passon';
const STORAGE_KEY_THEME = 'wearmore_theme';

export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEY_USER)) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_USER));
  }
  if (!localStorage.getItem(STORAGE_KEY_GARMENTS)) {
    localStorage.setItem(STORAGE_KEY_GARMENTS, JSON.stringify(getInitialDemoGarments()));
  }
  if (!localStorage.getItem(STORAGE_KEY_WEARS)) {
    localStorage.setItem(STORAGE_KEY_WEARS, JSON.stringify(getInitialDemoWearLogs()));
  }
  if (!localStorage.getItem(STORAGE_KEY_BADGES)) {
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(getInitialDemoBadges()));
  }
  if (!localStorage.getItem(STORAGE_KEY_PASSON)) {
    localStorage.setItem(STORAGE_KEY_PASSON, JSON.stringify([]));
  }
}

// User Profile
export function getUserProfile(): UserProfile {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEY_USER);
  return raw ? JSON.parse(raw) : DEMO_USER;
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
  return updated;
}

// Garments
export function getGarments(): Garment[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEY_GARMENTS);
  return raw ? JSON.parse(raw) : [];
}

export function getGarment(id: string): Garment | undefined {
  const garments = getGarments();
  return garments.find((g) => g.id === id);
}

export function addGarment(garment: Omit<Garment, 'id' | 'created_at'>): Garment {
  const garments = getGarments();
  const newGarment: Garment = {
    ...garment,
    id: `garm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };
  garments.unshift(newGarment);
  localStorage.setItem(STORAGE_KEY_GARMENTS, JSON.stringify(garments));
  checkAndAwardBadges();
  return newGarment;
}

export function updateGarment(id: string, updates: Partial<Garment>): Garment | null {
  const garments = getGarments();
  const index = garments.findIndex((g) => g.id === id);
  if (index === -1) return null;
  garments[index] = { ...garments[index], ...updates };
  localStorage.setItem(STORAGE_KEY_GARMENTS, JSON.stringify(garments));
  return garments[index];
}

export function deleteGarment(id: string): boolean {
  let garments = getGarments();
  garments = garments.filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEY_GARMENTS, JSON.stringify(garments));

  // Also remove wear logs
  let wears = getWearLogs();
  wears = wears.filter((w) => w.garment_id !== id);
  localStorage.setItem(STORAGE_KEY_WEARS, JSON.stringify(wears));
  return true;
}

// Wear Logs
export function getWearLogs(): WearLog[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEY_WEARS);
  return raw ? JSON.parse(raw) : [];
}

export function getGarmentStats(garmentId: string): GarmentStats {
  const garment = getGarment(garmentId);
  const wears = getWearLogs().filter((w) => w.garment_id === garmentId);
  const wearCount = wears.length;

  let lastWorn: string | null = null;
  if (wearCount > 0) {
    wears.sort((a, b) => (a.worn_on > b.worn_on ? -1 : 1));
    lastWorn = wears[0].worn_on;
  }

  const price = garment ? garment.price : 0;
  const costPerWear = Math.round((price / Math.max(wearCount, 1)) * 100) / 100;

  // Check if worn in last 7 days
  const sevenDaysAgo = getDateOffset(7);
  const wornInLast7Days = wears.some((w) => w.worn_on >= sevenDaysAgo);

  return {
    garment_id: garmentId,
    wear_count: wearCount,
    last_worn: lastWorn,
    cost_per_wear: costPerWear,
    worn_in_last_7_days: wornInLast7Days,
  };
}

export function logWears(
  garmentIds: string[],
  wornOn?: string
): { logged: number; newBadges: string[]; streak: StreakInfo } {
  const dateStr = wornOn || getTodayDateString();
  const user = getUserProfile();
  const currentLogs = getWearLogs();
  let loggedCount = 0;

  garmentIds.forEach((garmentId) => {
    // Unique check on (garment_id, worn_on)
    const exists = currentLogs.some(
      (log) => log.garment_id === garmentId && log.worn_on === dateStr
    );
    if (!exists) {
      currentLogs.push({
        id: `wlog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        garment_id: garmentId,
        user_id: user.id,
        worn_on: dateStr,
        created_at: new Date().toISOString(),
      });
      loggedCount++;
    }
  });

  localStorage.setItem(STORAGE_KEY_WEARS, JSON.stringify(currentLogs));
  const newBadges = checkAndAwardBadges();
  const streak = calculateStreak(user.id);

  return {
    logged: loggedCount,
    newBadges,
    streak,
  };
}

export function undoWear(garmentId: string, wornOn?: string): boolean {
  const dateStr = wornOn || getTodayDateString();
  let wears = getWearLogs();
  const initialLength = wears.length;
  wears = wears.filter(
    (w) => !(w.garment_id === garmentId && w.worn_on === dateStr)
  );
  if (wears.length !== initialLength) {
    localStorage.setItem(STORAGE_KEY_WEARS, JSON.stringify(wears));
    return true;
  }
  return false;
}

// Streak Calculation
export function calculateStreak(userId?: string): StreakInfo {
  const wears = getWearLogs();
  const distinctDates = Array.from(new Set(wears.map((w) => w.worn_on))).sort();

  const today = getTodayDateString();
  const yesterday = getDateOffset(1);

  const hasToday = distinctDates.includes(today);
  const hasYesterday = distinctDates.includes(yesterday);

  let currentStreak = 0;

  if (distinctDates.length > 0) {
    // A streak is active if logged today OR logged yesterday
    let checkDate: Date;
    if (hasToday) {
      checkDate = new Date();
    } else if (hasYesterday) {
      checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate = new Date(0); // broken
    }

    if (checkDate.getTime() > 0) {
      while (true) {
        const y = checkDate.getFullYear();
        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
        const d = String(checkDate.getDate()).padStart(2, '0');
        const ds = `${y}-${m}-${d}`;

        if (distinctDates.includes(ds)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // Longest streak
  let longestStreak = currentStreak;
  let tempStreak = 0;
  if (distinctDates.length > 0) {
    const datesAsTime = distinctDates.map((d) => new Date(d + 'T00:00:00Z').getTime());
    tempStreak = 1;
    longestStreak = Math.max(longestStreak, 1);

    for (let i = 1; i < datesAsTime.length; i++) {
      const diffDays = Math.round((datesAsTime[i] - datesAsTime[i - 1]) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
  }

  // Last 7 days status
  const last7Days: { date: string; logged: boolean; dayLabel: string }[] = [];
  const daysShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dayNum}`;
    const dayLabel = i === 0 ? 'Today' : daysShort[d.getDay()];

    last7Days.push({
      date: dateStr,
      logged: distinctDates.includes(dateStr),
      dayLabel,
    });
  }

  return {
    current_streak: currentStreak,
    longest_streak: Math.max(longestStreak, currentStreak),
    last7Days,
  };
}

// Badges
export function getUserBadges(): UserBadge[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEY_BADGES);
  return raw ? JSON.parse(raw) : [];
}

export function checkAndAwardBadges(): string[] {
  const user = getUserProfile();
  const badges = getUserBadges();
  const earnedKeys = new Set(badges.map((b) => b.badge_key));
  const newAwarded: string[] = [];

  const garments = getGarments();
  const wears = getWearLogs();
  const streak = calculateStreak(user.id);
  const passons = getPassOnRequests();

  // Rule 1: first_wear
  if (!earnedKeys.has('first_wear') && wears.length >= 1) {
    newAwarded.push('first_wear');
  }

  // Rule 2: streak_7
  if (!earnedKeys.has('streak_7') && streak.current_streak >= 7) {
    newAwarded.push('streak_7');
  }

  // Rule 3: streak_30
  if (!earnedKeys.has('streak_30') && streak.current_streak >= 30) {
    newAwarded.push('streak_30');
  }

  // Rule 4: wears_10 (any garment >= 10 wears)
  if (!earnedKeys.has('wears_10')) {
    const counts: Record<string, number> = {};
    wears.forEach((w) => {
      counts[w.garment_id] = (counts[w.garment_id] || 0) + 1;
    });
    const has10 = Object.values(counts).some((count) => count >= 10);
    if (has10) {
      newAwarded.push('wears_10');
    }
  }

  // Rule 5: cpw_under_5 (cost per wear below 50 in INR or 5 in USD)
  if (!earnedKeys.has('cpw_under_5')) {
    const threshold = user.currency === 'INR' ? 50 : 5;
    const qualified = garments.some((g) => {
      const stats = getGarmentStats(g.id);
      return stats.wear_count > 0 && stats.cost_per_wear < threshold;
    });
    if (qualified) {
      newAwarded.push('cpw_under_5');
    }
  }

  // Rule 6: closet_10 (10 garments catalogued)
  if (!earnedKeys.has('closet_10') && garments.length >= 10) {
    newAwarded.push('closet_10');
  }

  // Rule 7: passed_on_1 (first garment passed on)
  if (!earnedKeys.has('passed_on_1') && passons.length >= 1) {
    newAwarded.push('passed_on_1');
  }

  if (newAwarded.length > 0) {
    const updatedBadges = [...badges];
    newAwarded.forEach((key) => {
      updatedBadges.push({
        id: `bdg_${Date.now()}_${key}`,
        user_id: user.id,
        badge_key: key,
        earned_at: new Date().toISOString(),
      });
    });
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(updatedBadges));
  }

  return newAwarded;
}

// Pass on
export function getPassOnRequests(): PassOnRequest[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEY_PASSON);
  return raw ? JSON.parse(raw) : [];
}

export function createPassOn(
  garmentId: string,
  type: 'donate' | 'sell',
  ngoId?: string | null,
  note?: string
): { request: PassOnRequest; resalePrice: number | null } {
  const garment = getGarment(garmentId);
  if (!garment) throw new Error('Garment not found');

  const user = getUserProfile();
  const resalePrice = type === 'sell' ? Math.round(garment.price * 0.2 * 100) / 100 : null;

  const request: PassOnRequest = {
    id: `pass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    garment_id: garmentId,
    user_id: user.id,
    type,
    ngo_id: ngoId || null,
    resale_price: resalePrice,
    note: note || '',
    created_at: new Date().toISOString(),
  };

  const passons = getPassOnRequests();
  passons.unshift(request);
  localStorage.setItem(STORAGE_KEY_PASSON, JSON.stringify(passons));

  // Update garment status in same transaction
  const newStatus = type === 'donate' ? 'donated' : 'listed_for_sale';
  updateGarment(garmentId, { status: newStatus });

  checkAndAwardBadges();

  return { request, resalePrice };
}

// Reset Demo Data
export function resetDemoData() {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_USER));
  localStorage.setItem(STORAGE_KEY_GARMENTS, JSON.stringify(getInitialDemoGarments()));
  localStorage.setItem(STORAGE_KEY_WEARS, JSON.stringify(getInitialDemoWearLogs()));
  localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(getInitialDemoBadges()));
  localStorage.setItem(STORAGE_KEY_PASSON, JSON.stringify([]));
}
