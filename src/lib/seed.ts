import { Garment, UserBadge, UserProfile, WearLog } from '../types';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DEMO_USER: UserProfile = {
  id: 'usr_aarav_demo',
  display_name: 'Aarav',
  currency: 'INR',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  onboarded: true,
  created_at: getDateOffset(50),
};

export const COLOR_SWATCHES = [
  { key: 'indigo', label: 'Indigo', hex: '#264653' },
  { key: 'sand', label: 'Sand / Ecru', hex: '#E9D8A6' },
  { key: 'olive', label: 'Olive Green', hex: '#4A5844' },
  { key: 'chestnut', label: 'Chestnut Brown', hex: '#8C4E34' },
  { key: 'black', label: 'Charcoal Black', hex: '#2B2D42' },
  { key: 'white', label: 'Linen White', hex: '#F4F1DE' },
  { key: 'terracotta', label: 'Terracotta', hex: '#D9774B' },
  { key: 'forest', label: 'Deep Forest', hex: '#2F6B4F' },
  { key: 'slate', label: 'Slate Grey', hex: '#6C757D' },
  { key: 'mustard', label: 'Mustard Gold', hex: '#EE9B00' },
];

export function getInitialDemoGarments(): Garment[] {
  return [
    {
      id: 'garm_1',
      user_id: 'usr_aarav_demo',
      name: 'Selvedge Denim Chore Jacket',
      category: 'outerwear',
      colour: 'indigo',
      price: 3600,
      photo_path: '/src/assets/images/denim_jacket_1792929903155.jpg',
      status: 'active',
      created_at: getDateOffset(48),
    },
    {
      id: 'garm_2',
      user_id: 'usr_aarav_demo',
      name: 'Organic Relaxed Linen Shirt',
      category: 'top',
      colour: 'white',
      price: 1850,
      photo_path: '/src/assets/images/linen_shirt_1792929903640.jpg',
      status: 'active',
      created_at: getDateOffset(46),
    },
    {
      id: 'garm_3',
      user_id: 'usr_aarav_demo',
      name: 'Olive Cable Knit Wool Sweater',
      category: 'top',
      colour: 'olive',
      price: 2900,
      photo_path: '/src/assets/images/wool_sweater_1792929904587.jpg',
      status: 'active',
      created_at: getDateOffset(44),
    },
    {
      id: 'garm_4',
      user_id: 'usr_aarav_demo',
      name: 'Handcrafted Chestnut Chelsea Boots',
      category: 'shoes',
      colour: 'chestnut',
      price: 4800,
      photo_path: '/src/assets/images/chelsea_boots_1792929905119.jpg',
      status: 'active',
      created_at: getDateOffset(45),
    },
    {
      id: 'garm_5',
      user_id: 'usr_aarav_demo',
      name: 'Tapered Khaki Cotton Chinos',
      category: 'bottom',
      colour: 'sand',
      price: 1600,
      photo_path: '/src/assets/images/cotton_chinos_1792929905043.jpg',
      status: 'active',
      created_at: getDateOffset(42),
    },
    {
      id: 'garm_6',
      user_id: 'usr_aarav_demo',
      name: 'Heavyweight Sand Crewneck T-Shirt',
      category: 'top',
      colour: 'sand',
      price: 850,
      photo_path: '/src/assets/images/linen_shirt_1792929903640.jpg',
      status: 'active',
      created_at: getDateOffset(40),
    },
    {
      id: 'garm_7',
      user_id: 'usr_aarav_demo',
      name: 'Raw Indigo Straight Leg Jeans',
      category: 'bottom',
      colour: 'indigo',
      price: 2400,
      photo_path: '/src/assets/images/denim_jacket_1792929903155.jpg',
      status: 'active',
      created_at: getDateOffset(38),
    },
    {
      id: 'garm_8',
      user_id: 'usr_aarav_demo',
      name: 'Charcoal Merino Beanie',
      category: 'accessory',
      colour: 'black',
      price: 650,
      photo_path: '/src/assets/images/wool_sweater_1792929904587.jpg',
      status: 'active',
      created_at: getDateOffset(35),
    },
    {
      id: 'garm_9',
      user_id: 'usr_aarav_demo',
      name: 'Canvas Weekender Tote',
      category: 'accessory',
      colour: 'sand',
      price: 1100,
      photo_path: '/src/assets/images/cotton_chinos_1792929905043.jpg',
      status: 'active',
      created_at: getDateOffset(30),
    },
    {
      id: 'garm_10',
      user_id: 'usr_aarav_demo',
      name: 'Forest Waxed Field Parka',
      category: 'outerwear',
      colour: 'forest',
      price: 5200,
      photo_path: '/src/assets/images/denim_jacket_1792929903155.jpg',
      status: 'active',
      created_at: getDateOffset(28),
    },
    {
      id: 'garm_11',
      user_id: 'usr_aarav_demo',
      name: 'Terracotta Waffle Knit Overshirt',
      category: 'top',
      colour: 'terracotta',
      price: 2100,
      photo_path: '/src/assets/images/wool_sweater_1792929904587.jpg',
      status: 'active',
      created_at: getDateOffset(25),
    },
    {
      id: 'garm_12',
      user_id: 'usr_aarav_demo',
      name: 'Vintage Chambray Workshirt',
      category: 'top',
      colour: 'indigo',
      price: 1450,
      photo_path: '/src/assets/images/linen_shirt_1792929903640.jpg',
      status: 'active',
      created_at: getDateOffset(20),
    },
  ];
}

export function getInitialDemoWearLogs(): WearLog[] {
  const logs: WearLog[] = [];
  let logId = 1;

  // Streak: last 9 days (from 8 days ago up to 0 days ago / today)
  for (let i = 8; i >= 0; i--) {
    const day = getDateOffset(i);
    // On each day of streak, Aarav wore 1 to 3 items
    logs.push({
      id: `wlog_${logId++}`,
      garment_id: 'garm_5', // Cotton chinos - worn very often
      user_id: 'usr_aarav_demo',
      worn_on: day,
      created_at: `${day}T08:30:00Z`,
    });

    if (i % 2 === 0) {
      logs.push({
        id: `wlog_${logId++}`,
        garment_id: 'garm_2', // Linen shirt
        user_id: 'usr_aarav_demo',
        worn_on: day,
        created_at: `${day}T08:31:00Z`,
      });
    } else {
      logs.push({
        id: `wlog_${logId++}`,
        garment_id: 'garm_6', // T-shirt
        user_id: 'usr_aarav_demo',
        worn_on: day,
        created_at: `${day}T08:32:00Z`,
      });
    }

    if (i <= 4) {
      logs.push({
        id: `wlog_${logId++}`,
        garment_id: 'garm_1', // Denim jacket
        user_id: 'usr_aarav_demo',
        worn_on: day,
        created_at: `${day}T08:33:00Z`,
      });
    }
  }

  // Realistic older wears over the past 45 days
  const olderDays = [11, 12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 28, 30, 32, 35, 38, 40, 42, 44];
  olderDays.forEach((daysAgo) => {
    const day = getDateOffset(daysAgo);
    logs.push({
      id: `wlog_${logId++}`,
      garment_id: 'garm_5', // Chinos
      user_id: 'usr_aarav_demo',
      worn_on: day,
      created_at: `${day}T09:00:00Z`,
    });
    logs.push({
      id: `wlog_${logId++}`,
      garment_id: 'garm_4', // Chelsea boots
      user_id: 'usr_aarav_demo',
      worn_on: day,
      created_at: `${day}T09:01:00Z`,
    });
    if (daysAgo % 3 === 0) {
      logs.push({
        id: `wlog_${logId++}`,
        garment_id: 'garm_3', // Wool sweater
        user_id: 'usr_aarav_demo',
        worn_on: day,
        created_at: `${day}T09:02:00Z`,
      });
    }
    if (daysAgo % 4 === 0) {
      logs.push({
        id: `wlog_${logId++}`,
        garment_id: 'garm_7', // Jeans
        user_id: 'usr_aarav_demo',
        worn_on: day,
        created_at: `${day}T09:03:00Z`,
      });
    }
  });

  return logs;
}

export function getInitialDemoBadges(): UserBadge[] {
  return [
    {
      id: 'bdg_1',
      user_id: 'usr_aarav_demo',
      badge_key: 'first_wear',
      earned_at: getDateOffset(48),
    },
    {
      id: 'bdg_2',
      user_id: 'usr_aarav_demo',
      badge_key: 'streak_7',
      earned_at: getDateOffset(2),
    },
    {
      id: 'bdg_3',
      user_id: 'usr_aarav_demo',
      badge_key: 'closet_10',
      earned_at: getDateOffset(28),
    },
    {
      id: 'bdg_4',
      user_id: 'usr_aarav_demo',
      badge_key: 'wears_10',
      earned_at: getDateOffset(7),
    },
  ];
}
