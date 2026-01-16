
import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, PaymentStatus, User, TourPackage } from '../types';
import { dataService } from '../services/dataService';

interface BookingManagerProps {
  user: User;
}

const BookingManager: React.FC<BookingManagerProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking>>({
    customerName: '',
    whatsapp: '',
    email: '',
    adultCount: 1,
    childCount: 0,
    departureDate: '',
    notes: '',
    status: BookingStatus.BOOKING,
    paymentStatus: PaymentStatus.UNPAID,
    paymentMethod: 'Cash',
    paidAmount: 0
  });

  useEffect(() => {
    setBookings(dataService.getBookings());
    setPackages(dataService.getPackages());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find(p => p.id === currentBooking.packageId);
    if (!pkg) return alert('Pilih paket wisata');

    const totalAmount = (pkg.priceAdult * (currentBooking.adultCount || 0)) + 
                        (pkg.priceChild * (currentBooking.childCount || 0));

    const newBooking: Booking = {
      ...(currentBooking as Booking),
      id: currentBooking.id || Date.now().toString(),
      totalAmount,
      createdAt: currentBooking.createdAt || new Date().toISOString()
    };

    const updated = currentBooking.id 
      ? bookings.map(b => b.id === currentBooking.id ? newBooking : b)
      : [...bookings, newBooking];

    setBookings(updated);
    dataService.saveBookings(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus pemesanan ini?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      dataService.saveBookings(updated);
    }
  };

  const exportData = () => {
    dataService.exportToCsv(bookings, 'data_pemesanan');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Pemesanan</h2>
          <p className="text-gray-500 text-sm">Input data konsumen dan kelola status trip.</p>
        </div>
        <div className="flex gap-2">
          {user.role === 'admin' && (
            <button onClick={exportData} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Ekspor CSV
            </button>
          )}
          <button
            onClick={() => { setCurrentBooking({ customerName: '', whatsapp: '', email: '', adultCount: 1, childCount: 0, status: BookingStatus.BOOKING, paymentStatus: PaymentStatus.UNPAID, paymentMethod: 'Cash', paidAmount: 0 }); setIsModalOpen(true); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Booking Baru
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konsumen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket & Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pax</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{booking.customerName}</div>
                    <div className="text-xs text-gray-500">{booking.whatsapp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{packages.find(p => p.id === booking.packageId)?.name}</div>
                    <div className="text-xs text-indigo-600 font-bold">{booking.departureDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.adultCount}D / {booking.childCount}A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Rp {booking.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => { setCurrentBooking(booking); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(booking.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Belum ada data pemesanan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Data Pemesanan</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Nama Konsumen</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={currentBooking.customerName} onChange={e => setCurrentBooking({...currentBooking, customerName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">No. WhatsApp</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={currentBooking.whatsapp} onChange={e => setCurrentBooking({...currentBooking, whatsapp: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg" value={currentBooking.email} onChange={e => setCurrentBooking({...currentBooking, email: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Pilih Paket</label>
                  <select required className="w-full px-4 py-2 border rounded-lg" value={currentBooking.packageId} onChange={e => setCurrentBooking({...currentBooking, packageId: e.target.value})}>
                    <option value="">-- Pilih Paket --</option>
                    {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Keberangkatan</label>
                  <input required type="date" className="w-full px-4 py-2 border rounded-lg" value={currentBooking.departureDate} onChange={e => setCurrentBooking({...currentBooking, departureDate: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Dewasa</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" value={currentBooking.adultCount} onChange={e => setCurrentBooking({...currentBooking, adultCount: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Anak</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" value={currentBooking.childCount} onChange={e => setCurrentBooking({...currentBooking, childCount: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Status Progress</label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={currentBooking.status} onChange={e => setCurrentBooking({...currentBooking, status: e.target.value as BookingStatus})}>
                    {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Catatan</label>
                   <textarea className="w-full px-4 py-2 border rounded-lg" value={currentBooking.notes} onChange={e => setCurrentBooking({...currentBooking, notes: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition mt-4">Simpan Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
