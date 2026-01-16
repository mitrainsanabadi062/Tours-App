
import React, { useState, useEffect } from 'react';
import { User, Booking, TourPackage } from '../types';
import { dataService } from '../services/dataService';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  
  useEffect(() => {
    // Load fresh data from persistent storage on dashboard mount
    setBookings(dataService.getBookings());
    setPackages(dataService.getPackages());
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => {
    // Calculate total collected revenue
    return sum + (b.paymentStatus === 'Paid Off' ? b.totalAmount : b.paidAmount);
  }, 0);

  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'On-Trip').length;
  const newBookings = bookings.filter(b => b.status === 'Booking').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue (Admin Only) */}
        {user.role === 'admin' && (
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-600 rounded-lg p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Omzet</dt>
                    <dd className="text-xl font-black text-gray-900">Rp {totalRevenue.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Trips */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trip Berjalan</dt>
                  <dd className="text-xl font-black text-gray-900">{activeBookings}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* New Bookings */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-500 rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pemesanan Baru</dt>
                  <dd className="text-xl font-black text-gray-900">{newBookings}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Available Packages */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Paket</dt>
                  <dd className="text-xl font-black text-gray-900">{packages.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pemesanan Terbaru</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-100">
              {bookings.slice(-5).reverse().map((booking) => (
                <li key={booking.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{booking.customerName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {packages.find(p => p.id === booking.packageId)?.name || 'Paket tidak ditemukan'}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
              {bookings.length === 0 && <p className="text-gray-400 text-center py-10 italic">Belum ada pemesanan.</p>}
            </ul>
          </div>
        </div>

        {/* Hot Packages */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Paket Wisata Populer</h3>
          <div className="grid grid-cols-1 gap-4">
            {packages.slice(0, 3).map((pkg) => (
              <div key={pkg.id} className="flex items-center p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="h-12 w-12 flex-shrink-0 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 font-black text-xl">
                  {pkg.name[0]}
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-bold text-gray-900">{pkg.name}</div>
                  <div className="text-xs text-gray-500">{pkg.destination} • {pkg.duration}</div>
                </div>
                <div className="text-sm font-black text-teal-700">
                  Rp {pkg.priceAdult.toLocaleString()}
                </div>
              </div>
            ))}
            {packages.length === 0 && <p className="text-gray-400 text-center py-10 italic">Belum ada paket wisata.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
