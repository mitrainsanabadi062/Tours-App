
export type Role = 'admin' | 'kasir';

export interface User {
  id: string;
  username: string;
  role: Role;
}

export enum Category {
  DOMESTIC = 'Domestik',
  INTERNATIONAL = 'Luar Negeri'
}

export enum SubCategory {
  NATURE = 'Wisata Alam',
  FUNWORLD = 'Fun World',
  OUTDOOR = 'Outdoor',
  UMRAH = 'Umrah',
  PLAYGROUND = 'Play Ground'
}

export enum BookingStatus {
  BOOKING = 'Booking',
  CONFIRMED = 'Confirmed',
  ON_TRIP = 'On-Trip',
  FINISHED = 'Finished',
  CANCELLED = 'Cancelled'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  DP = 'Down Payment',
  PAID = 'Paid Off'
}

export interface TourPackage {
  id: string;
  name: string;
  category: Category;
  subCategory: SubCategory;
  destination: string;
  duration: string; // e.g., "3 Hari 2 Malam"
  facilities: string[];
  priceAdult: number;
  priceChild: number;
  priceVip: number;
  isWeekday: boolean;
  isWeekend: boolean;
  quotaPerDate: Record<string, number>; // Date string -> remaining seats
}

export interface Booking {
  id: string;
  packageId: string;
  customerName: string;
  whatsapp: string;
  email: string;
  adultCount: number;
  childCount: number;
  departureDate: string;
  notes: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'Cash' | 'Bank Transfer';
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'Hotel' | 'Transportasi' | 'Restoran' | 'Tour Guide' | 'Agen';
  contact: string;
  commission: number; // percentage or flat
}

export interface OperationalCost {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'Bensin' | 'Parkir' | 'Tip Guide' | 'Tiket Masuk' | 'Lainnya';
}

export interface AppSettings {
  companyName: string;
  description: string;
  address: string;
  contact: string;
  currency: string;
}
