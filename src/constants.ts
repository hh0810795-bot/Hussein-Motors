import { LeadStatus } from './types';

export const LEAD_STATUSES: LeadStatus[] = [
  'جديد',
  'تم التواصل',
  'مهتم',
  'تم البيع',
  'ملغي',
  'لا يرد',
  'مردش بعتنا واتس',
  'تم التواصل مع العميل وبيفكر وهيكلمنا',
  'مش مهتم',
  'السعر مش مناسب'
];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  'جديد': 'bg-blue-500',
  'تم التواصل': 'bg-yellow-500',
  'مهتم': 'bg-green-500',
  'تم البيع': 'bg-emerald-600',
  'ملغي': 'bg-red-500',
  'لا يرد': 'bg-zinc-500',
  'مردش بعتنا واتس': 'bg-purple-500',
  'تم التواصل مع العميل وبيفكر وهيكلمنا': 'bg-orange-500',
  'مش مهتم': 'bg-zinc-700',
  'السعر مش مناسب': 'bg-pink-500'
};

export const ADMIN_EMAIL = 'hh0810795@gmail.com';
export const ADMIN_PASSWORD = 'hussein1@'; // Note: This is for initial setup/reference, real auth is via Firebase

export const BRANDS = [
  'تويوتا',
  'هيونداي',
  'كيا',
  'مرسيدس',
  'بي ام دبليو',
  'أودي',
  'نيسان',
  'ميتسوبيشي',
  'شيفروليه',
  'فورد',
  'هوندا',
  'مازدا',
  'لكزس',
  'لاند روفر',
  'جيب',
  'أخرى'
];

export const FUEL_TYPES = [
  'بنزين',
  'ديزل',
  'هايبرد',
  'كهرباء'
];

export const TRANSMISSIONS = [
  'أوتوماتيك',
  'يدوي'
];
