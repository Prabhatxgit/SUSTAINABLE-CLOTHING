import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Garment,
  GarmentStats,
  PassOnRequest,
  StreakInfo,
  UserBadge,
  UserProfile,
  WearLog,
} from '../types';
import { BADGE_DEFINITIONS } from '../lib/badges';
import {
  addGarment as dbAddGarment,
  calculateStreak,
  createPassOn as dbCreatePassOn,
  deleteGarment as dbDeleteGarment,
  getGarment as dbGetGarment,
  getGarments as dbGetGarments,
  getGarmentStats as dbGetGarmentStats,
  getPassOnRequests as dbGetPassOnRequests,
  getUserBadges as dbGetUserBadges,
  getUserProfile as dbGetUserProfile,
  getWearLogs as dbGetWearLogs,
  logWears as dbLogWears,
  resetDemoData as dbResetDemoData,
  undoWear as dbUndoWear,
  updateGarment as dbUpdateGarment,
  updateUserProfile as dbUpdateUserProfile,
} from '../lib/storage';
import { getTodayDateString } from '../lib/seed';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  undoAction?: () => void;
  duration?: number;
}

interface AppContextType {
  user: UserProfile;
  garments: Garment[];
  wears: WearLog[];
  badges: UserBadge[];
  passOnRequests: PassOnRequest[];
  streak: StreakInfo;
  todayLoggedGarmentIds: string[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toasts: ToastMessage[];
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  formatPrice: (amount: number) => string;
  formatCurrencySymbol: () => string;
  logOutfit: (garmentIds: string[]) => { logged: number; newBadges: string[] };
  undoOutfitWear: (garmentId: string) => void;
  addNewGarment: (garment: Omit<Garment, 'id' | 'created_at'>) => Garment;
  editGarment: (id: string, updates: Partial<Garment>) => void;
  removeGarment: (id: string) => void;
  getGarmentById: (id: string) => Garment | undefined;
  getStatsForGarment: (id: string) => GarmentStats;
  passOnGarment: (
    garmentId: string,
    type: 'donate' | 'sell',
    ngoId?: string | null,
    note?: string
  ) => { request: PassOnRequest; resalePrice: number | null };
  resetDemo: () => void;
  changeUser: (user: Partial<UserProfile>) => void;
  onboardUser: () => void;
  recentCostPerWearChangeGarmentId: string | null;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(dbGetUserProfile);
  const [garments, setGarments] = useState<Garment[]>(dbGetGarments);
  const [wears, setWears] = useState<WearLog[]>(dbGetWearLogs);
  const [badges, setBadges] = useState<UserBadge[]>(dbGetUserBadges);
  const [passOnRequests, setPassOnRequests] = useState<PassOnRequest[]>(dbGetPassOnRequests);
  const [streak, setStreak] = useState<StreakInfo>(() => calculateStreak(user.id));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('wearmore_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });
  const [recentCostPerWearChangeGarmentId, setRecentCostPerWearChangeGarmentId] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wearmore_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wearmore_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const refreshAllState = useCallback(() => {
    const updatedUser = dbGetUserProfile();
    const updatedGarments = dbGetGarments();
    const updatedWears = dbGetWearLogs();
    const updatedBadges = dbGetUserBadges();
    const updatedPassOns = dbGetPassOnRequests();
    const updatedStreak = calculateStreak(updatedUser.id);

    setUser(updatedUser);
    setGarments(updatedGarments);
    setWears(updatedWears);
    setBadges(updatedBadges);
    setPassOnRequests(updatedPassOns);
    setStreak(updatedStreak);
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2F6B4F', '#D9774B', '#5FAE88', '#FAF7F2'],
      disableForReducedMotion: true,
    });
  }, []);

  const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...msg, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = msg.duration || (msg.undoAction ? 10000 : 3500);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Today's logged garment IDs
  const today = getTodayDateString();
  const todayLoggedGarmentIds = wears
    .filter((w) => w.worn_on === today)
    .map((w) => w.garment_id);

  const formatCurrencySymbol = useCallback(() => {
    switch (user.currency) {
      case 'INR':
        return 'Rs ';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return 'Rs ';
    }
  }, [user.currency]);

  const formatPrice = useCallback(
    (amount: number) => {
      const sym = formatCurrencySymbol();
      return `${sym}${amount.toLocaleString()}`;
    },
    [formatCurrencySymbol]
  );

  const logOutfit = useCallback(
    (garmentIds: string[]) => {
      const result = dbLogWears(garmentIds);
      refreshAllState();

      if (garmentIds.length > 0) {
        setRecentCostPerWearChangeGarmentId(garmentIds[0]);
        setTimeout(() => setRecentCostPerWearChangeGarmentId(null), 1500);
      }

      // Check if new badges unlocked
      if (result.newBadges.length > 0) {
        triggerConfetti();
        result.newBadges.forEach((key) => {
          const badgeDef = BADGE_DEFINITIONS.find((b) => b.key === key);
          addToast({
            type: 'success',
            message: `Badge Unlocked: ${badgeDef?.name || 'Achievement'}!`,
            duration: 5000,
          });
        });
      }

      // 10-second undo toast
      addToast({
        type: 'success',
        message: `Wore ${garmentIds.length} item${garmentIds.length > 1 ? 's' : ''} today. Streak: ${result.streak.current_streak} days!`,
        duration: 10000,
        undoAction: () => {
          garmentIds.forEach((id) => dbUndoWear(id));
          refreshAllState();
          addToast({
            type: 'info',
            message: 'Outfit logging undone.',
            duration: 3000,
          });
        },
      });

      return { logged: result.logged, newBadges: result.newBadges };
    },
    [addToast, refreshAllState, triggerConfetti]
  );

  const undoOutfitWear = useCallback(
    (garmentId: string) => {
      const success = dbUndoWear(garmentId);
      if (success) {
        refreshAllState();
        addToast({
          type: 'info',
          message: 'Wear removed for today.',
          duration: 3000,
        });
      }
    },
    [addToast, refreshAllState]
  );

  const addNewGarment = useCallback(
    (garment: Omit<Garment, 'id' | 'created_at'>) => {
      const created = dbAddGarment(garment);
      refreshAllState();
      addToast({
        type: 'success',
        message: 'Added. Now go wear it.',
        duration: 4000,
      });
      return created;
    },
    [addToast, refreshAllState]
  );

  const editGarment = useCallback(
    (id: string, updates: Partial<Garment>) => {
      dbUpdateGarment(id, updates);
      refreshAllState();
      addToast({
        type: 'success',
        message: 'Garment updated successfully.',
      });
    },
    [addToast, refreshAllState]
  );

  const removeGarment = useCallback(
    (id: string) => {
      dbDeleteGarment(id);
      refreshAllState();
      addToast({
        type: 'info',
        message: 'Garment removed from wardrobe.',
      });
    },
    [addToast, refreshAllState]
  );

  const getGarmentById = useCallback((id: string) => dbGetGarment(id), []);

  const getStatsForGarment = useCallback((id: string) => dbGetGarmentStats(id), []);

  const passOnGarment = useCallback(
    (
      garmentId: string,
      type: 'donate' | 'sell',
      ngoId?: string | null,
      note?: string
    ) => {
      const res = dbCreatePassOn(garmentId, type, ngoId, note);
      refreshAllState();
      addToast({
        type: 'success',
        message:
          type === 'donate'
            ? 'Garment queued for NGO collection donation.'
            : `Garment listed for circulation at 20% resale (${formatPrice(res.resalePrice || 0)}).`,
        duration: 5000,
      });
      return res;
    },
    [addToast, formatPrice, refreshAllState]
  );

  const resetDemo = useCallback(() => {
    dbResetDemoData();
    refreshAllState();
    addToast({
      type: 'info',
      message: 'Wardrobe and wear history reset to pilot demo state.',
    });
  }, [addToast, refreshAllState]);

  const changeUser = useCallback(
    (updates: Partial<UserProfile>) => {
      const updated = dbUpdateUserProfile(updates);
      setUser(updated);
      refreshAllState();
    },
    [refreshAllState]
  );

  const onboardUser = useCallback(() => {
    changeUser({ onboarded: true });
  }, [changeUser]);

  return (
    <AppContext.Provider
      value={{
        user,
        garments,
        wears,
        badges,
        passOnRequests,
        streak,
        todayLoggedGarmentIds,
        isDarkMode,
        toggleDarkMode,
        toasts,
        addToast,
        removeToast,
        formatPrice,
        formatCurrencySymbol,
        logOutfit,
        undoOutfitWear,
        addNewGarment,
        editGarment,
        removeGarment,
        getGarmentById,
        getStatsForGarment,
        passOnGarment,
        resetDemo,
        changeUser,
        onboardUser,
        recentCostPerWearChangeGarmentId,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
