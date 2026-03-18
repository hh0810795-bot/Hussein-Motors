export type UserRole = 'admin' | 'marketer' | 'customer';

export interface Car {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  extras: string[];
  featured: boolean;
  urgencyLabel?: string;
  brand: string;
  createdAt: string;
}

export type LeadStatus = 
  | 'جديد'
  | 'تم التواصل'
  | 'مهتم'
  | 'تم البيع'
  | 'ملغي'
  | 'لا يرد'
  | 'مردش بعتنا واتس'
  | 'تم التواصل مع العميل وبيفكر وهيكلمنا'
  | 'مش مهتم'
  | 'السعر مش مناسب';

export interface Lead {
  id: string;
  clientName: string;
  phone: string;
  email?: string;
  budget: number;
  carId: string;
  carTitle: string;
  message?: string;
  status: LeadStatus;
  marketerId: string;
  marketerName: string;
  createdAt: string;
}

export interface Marketer {
  uid: string;
  fullName: string;
  phone: string;
  email: string;
  cashNumber: string;
  totalLeads: number;
  confirmedDeals: number;
  paidCommissions: number;
  remainingCommissions: number;
  targetProgress: number;
  role: 'marketer';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Settings {
  commissionRate: number;
  targetRewards: {
    target: number;
    reward: number;
  }[];
}
