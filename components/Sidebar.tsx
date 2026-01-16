
import React from 'react';
import { Role } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  role: Role;
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  closeMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, currentView, setView, onLogout, closeMobile }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: ICONS.Dashboard, roles: ['admin', 'kasir'] },
    { id: 'packages', name: 'Paket Wisata', icon: ICONS.Packages, roles: ['admin', 'kasir'] },
    { id: 'bookings', name: 'Pemesanan', icon: ICONS.Booking, roles: ['admin', 'kasir'] },
    { id: 'finance', name: 'Transaksi & Bayar', icon: ICONS.Finance, roles: ['admin', 'kasir'] },
    { id: 'vendors', name: 'Vendor', icon: ICONS.Vendor, roles: ['admin'] },
    { id: 'reports', name: 'Laporan & Ops', icon: ICONS.Reports, roles: ['admin'] },
    { id: 'settings', name: 'Pengaturan', icon: ICONS.Settings, roles: ['admin'] },
  ];

  const handleNav = (id: string) => {
    setView(id);
    if (closeMobile) closeMobile();
  };

  return (
    <div className="flex flex-col w-64 bg-slate-900 h-full">
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-slate-800">
        <div className="text-white font-bold text-xl tracking-wider">TOUREASE PRO</div>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.filter(item => item.roles.includes(role)).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`${
                currentView === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } group flex items-center px-3 py-3 text-sm font-medium rounded-md w-full transition-all duration-200`}
            >
              <span className="mr-3">{item.icon()}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-slate-800 p-4">
        <button
          onClick={onLogout}
          className="flex-shrink-0 w-full group block text-slate-400 hover:text-white"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
