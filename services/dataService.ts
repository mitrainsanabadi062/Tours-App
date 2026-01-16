
import { TourPackage, Booking, Vendor, OperationalCost, AppSettings } from '../types';
import { MOCK_PACKAGES, INITIAL_SETTINGS } from '../constants';

const KEYS = {
  PACKAGES: 'te_packages',
  BOOKINGS: 'te_bookings',
  VENDORS: 'te_vendors',
  COSTS: 'te_costs',
  SETTINGS: 'te_settings'
};

const safeGet = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return defaultValue;
  }
};

const safeSet = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Penyimpanan lokal penuh. Harap hapus beberapa data lama.');
    }
  }
};

export const dataService = {
  getPackages: (): TourPackage[] => safeGet(KEYS.PACKAGES, MOCK_PACKAGES),
  savePackages: (pkgs: TourPackage[]) => safeSet(KEYS.PACKAGES, pkgs),
  
  getBookings: (): Booking[] => safeGet(KEYS.BOOKINGS, []),
  saveBookings: (bookings: Booking[]) => safeSet(KEYS.BOOKINGS, bookings),

  getVendors: (): Vendor[] => safeGet(KEYS.VENDORS, []),
  saveVendors: (vendors: Vendor[]) => safeSet(KEYS.VENDORS, vendors),

  getCosts: (): OperationalCost[] => safeGet(KEYS.COSTS, []),
  saveCosts: (costs: OperationalCost[]) => safeSet(KEYS.COSTS, costs),

  getSettings: (): AppSettings => safeGet(KEYS.SETTINGS, INITIAL_SETTINGS),
  saveSettings: (settings: AppSettings) => safeSet(KEYS.SETTINGS, settings),

  // Advanced Export as CSV
  exportToCsv: (data: any[], filename: string) => {
    if (!data || !data.length) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }
    
    try {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(obj => 
        Object.values(obj).map(val => 
          typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(',')
      ).join('\n');
      
      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Gagal mengekspor data.');
    }
  }
};
