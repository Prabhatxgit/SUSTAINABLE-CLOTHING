import { BadgeDefinition } from '../types';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: 'first_wear',
    name: 'First Wear',
    description: 'You took your first intentional step towards wearing what you own.',
    rule: '1 wear logged',
    icon: 'Sparkles',
  },
  {
    key: 'streak_7',
    name: 'Seven-Day Streak',
    description: 'Logged your outfit every day for a full week.',
    rule: '7-day streak',
    icon: 'Flame',
  },
  {
    key: 'streak_30',
    name: 'Thirty-Day Streak',
    description: 'A whole month of conscious wardrobe mindfulness.',
    rule: '30-day streak',
    icon: 'Zap',
  },
  {
    key: 'wears_10',
    name: 'Ten Times Over',
    description: 'Wore a single garment at least 10 times.',
    rule: '10+ wears on one garment',
    icon: 'Repeat',
  },
  {
    key: 'cpw_under_5',
    name: 'Pays for Itself',
    description: 'Brought a garment below the price of a daily coffee per wear.',
    rule: 'Cost per wear < ₹50 / $5',
    icon: 'Coffee',
  },
  {
    key: 'closet_10',
    name: 'Full Closet',
    description: 'Curated and catalogued at least 10 pieces in your slow wardrobe.',
    rule: '10 garments catalogued',
    icon: 'Shirt',
  },
  {
    key: 'passed_on_1',
    name: 'Second Life',
    description: 'Passed on a beloved piece to an NGO or listed for resale circulation.',
    rule: '1 garment passed on',
    icon: 'HeartHandshake',
  },
];

export const PILOT_NGOS = [
  {
    id: 'goonj',
    name: 'Goonj Vastradaan',
    tagline: 'Turning urban surplus into rural development currency.',
    focus: 'Rural dignity & community clothing circulation',
    location: 'Pan-India',
  },
  {
    id: 'clothes-box',
    name: 'Clothes Box Foundation',
    tagline: 'Upcycling clean wearable textiles for underprivileged families.',
    focus: 'Disaster relief & cold winter drives',
    location: 'Delhi NCR & North India',
  },
  {
    id: 'red-cross',
    name: 'Red Cross / Social Closet',
    tagline: 'Direct community distribution to shelter programs.',
    focus: 'Emergency assistance & disaster support',
    location: 'Global / Nationwide',
  },
];
