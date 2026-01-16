
import { TourPackage, Booking, Vendor, OperationalCost, AppSettings } from '../types';
import { MOCK_PACKAGES, INITIAL_SETTINGS } from '../constants';

const KEYS = {
  PACKAGES: 'te_packages',
  BOOKINGS: 'te_bookings',
  VENDORS: 'te_vendors',
  COSTS: 'te_costs',
  SETTINGS: 'te_settings'
};

export const dataService = {
  getPackages: (): TourPackage[] => {
    const data = localStorage.getItem(KEYS.PACKAGES);
    return data ? JSON.parse(data) : MOCK_PACKAGES;
  },
  savePackages: (pkgs: TourPackage[]) => {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(pkgs));
  },
  
  getBookings: (): Booking[] => {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },
  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getVendors: (): Vendor[] => {
    const data = localStorage.getItem(KEYS.VENDORS);
    return data ? JSON.parse(data) : [];
  },
  saveVendors: (vendors: Vendor[]) => {
    localStorage.setItem(KEYS.VENDORS, JSON.stringify(vendors));
  },

  getCosts: (): OperationalCost[] => {
    const data = localStorage.getItem(KEYS.COSTS);
    return data ? JSON.parse(data) : [];
  },
  saveCosts: (costs: OperationalCost[]) => {
    localStorage.setItem(KEYS.COSTS, JSON.stringify(costs));
  },

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  },
  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Export as CSV simulation
  exportToCsv: (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
