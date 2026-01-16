
import React, { useState, useEffect } from 'react';
import { Booking, PaymentStatus, User, TourPackage } from '../types';
import { dataService } from '../services/dataService';

interface FinanceProps {
  user: User;
}

const Finance: React.FC<FinanceProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    setBookings(dataService.getBookings());
    setPackages(dataService.getPackages());
  }, []);

  const updatePayment = (id: string, status: PaymentStatus, amount: number) => {
    const updated = bookings.map(b => b.id === id ? { ...b, paymentStatus: status, paidAmount: amount } : b);
    setBookings(updated);
    dataService.saveBookings(updated);
  };

  const getPackageName = (id: string) => packages.find(p => p.id === id)?.name || 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transaksi & Pembayaran</h2>
        <p className="text-gray-500 text-sm">Pantau status pembayaran dan terbitkan invoice.</p>
      </div>

      <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tagihan</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Dibayar</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{b.customerName}</div>
                    <div className="text-xs text-gray-500">{getPackageName(b.packageId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    Rp {b.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <input 
                      type="number" 
                      className="w-32 px-2 py-1 border rounded text-sm" 
                      value={b.paidAmount} 
                      onChange={(e) => updatePayment(b.id, b.paymentStatus, Number(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      className={`text-xs font-bold py-1 px-2 rounded-lg border-none ${
                        b.paymentStatus === PaymentStatus.PAID ? 'bg-green-100 text-green-700' : 
                        b.paymentStatus === PaymentStatus.DP ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}
                      value={b.paymentStatus}
                      onChange={(e) => updatePayment(b.id, e.target.value as PaymentStatus, b.paidAmount)}
                    >
                      {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => { setSelectedBooking(b); setShowInvoice(true); }}
                      className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInvoice && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowInvoice(false)} className="absolute top-4 right-4 text-gray-400 text-2xl">&times;</button>
            <div className="flex justify-between items-start mb-10 border-b pb-6">
              <div>
                <h1 className="text-3xl font-black text-indigo-600 tracking-tighter italic">TOUREASE PRO</h1>
                <p className="text-gray-500 text-xs mt-1">Invoice Perjalanan Wisata</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">#INV-{selectedBooking.id.slice(-6)}</p>
                <p className="text-xs text-gray-500">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Diterbitkan Untuk</p>
                <p className="font-bold text-gray-900 text-lg">{selectedBooking.customerName}</p>
                <p className="text-sm text-gray-500">{selectedBooking.whatsapp}</p>
                <p className="text-sm text-gray-500">{selectedBooking.email || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paket Wisata</p>
                <p className="font-bold text-gray-900">{getPackageName(selectedBooking.packageId)}</p>
                <p className="text-sm text-gray-500">Berangkat: {selectedBooking.departureDate}</p>
                <p className="text-sm text-gray-500">{selectedBooking.adultCount} Dewasa, {selectedBooking.childCount} Anak</p>
              </div>
            </div>

            <div className="border-t border-b py-6 mb-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Total Tagihan</span>
                <span className="text-xl font-bold text-gray-900">Rp {selectedBooking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Telah Dibayar</span>
                <span className="text-xl font-bold text-indigo-600">Rp {selectedBooking.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t mt-2">
                <span className="text-gray-900 font-bold uppercase text-xs">Sisa Tagihan</span>
                <span className="text-2xl font-black text-red-600">Rp {(selectedBooking.totalAmount - selectedBooking.paidAmount).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-500 leading-relaxed">
              <p className="font-bold text-gray-700 mb-1">Metode Pembayaran:</p>
              <p>Metode: {selectedBooking.paymentMethod}</p>
              <p>Status: {selectedBooking.paymentStatus}</p>
              <p className="mt-2 italic">*Harap simpan bukti pembayaran ini sebagai tiket keberangkatan resmi.</p>
            </div>

            <div className="mt-10 flex gap-4 no-print">
              <button onClick={() => window.print()} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold">Cetak Invoice</button>
              <button onClick={() => setShowInvoice(false)} className="px-6 py-3 border rounded-lg font-bold text-gray-600">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
