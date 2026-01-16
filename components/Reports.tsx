
import React, { useState, useEffect } from 'react';
import { Booking, OperationalCost, Vendor } from '../types';
import { dataService } from '../services/dataService';

const Reports: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [costs, setCosts] = useState<OperationalCost[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCost, setNewCost] = useState<Partial<OperationalCost>>({
    description: '',
    amount: 0,
    category: 'Lainnya',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setBookings(dataService.getBookings());
    setCosts(dataService.getCosts());
    setVendors(dataService.getVendors());
  }, []);

  const totalOmzet = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'Paid Off' ? b.totalAmount : b.paidAmount), 0);
  const totalOperational = costs.reduce((sum, c) => sum + c.amount, 0);
  
  // Calculate approximate commissions (simulated)
  const totalCommission = bookings.reduce((sum, b) => {
    // In a real app, you'd match vendors to bookings. We'll simulate based on vendor averages.
    const avgCommission = vendors.length > 0 ? vendors[0].commission : 0;
    return sum + (avgCommission * (b.adultCount + b.childCount));
  }, 0);

  const netProfit = totalOmzet - totalOperational - totalCommission;

  const handleSaveCost = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...costs, { ...newCost, id: Date.now().toString() } as OperationalCost];
    setCosts(updated);
    dataService.saveCosts(updated);
    setIsModalOpen(false);
    setNewCost({ description: '', amount: 0, category: 'Lainnya', date: new Date().toISOString().split('T')[0] });
  };

  const deleteCost = (id: string) => {
    const updated = costs.filter(c => c.id !== id);
    setCosts(updated);
    dataService.saveCosts(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laporan & Operasional</h2>
          <p className="text-gray-500 text-sm">Rekap laba bersih dan pengeluaran operasional.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100">
           <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Omzet Terkumpul</p>
           <h3 className="text-3xl font-black">Rp {totalOmzet.toLocaleString()}</h3>
        </div>
        <div className="bg-red-500 p-6 rounded-2xl text-white shadow-xl shadow-red-100">
           <p className="text-red-100 text-xs font-bold uppercase tracking-widest mb-1">Biaya Operasional</p>
           <h3 className="text-3xl font-black">Rp {(totalOperational + totalCommission).toLocaleString()}</h3>
           <p className="text-[10px] mt-2 opacity-80">*Termasuk estimasi komisi vendor</p>
        </div>
        <div className="bg-green-600 p-6 rounded-2xl text-white shadow-xl shadow-green-100">
           <p className="text-green-100 text-xs font-bold uppercase tracking-widest mb-1">Profit Sharing (Laba Bersih)</p>
           <h3 className="text-3xl font-black">Rp {netProfit.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h4 className="font-bold text-gray-900">Rincian Biaya Operasional</h4>
          <button onClick={() => setIsModalOpen(true)} className="text-xs bg-gray-900 text-white px-3 py-2 rounded-lg font-bold">Input Biaya</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Jumlah</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {costs.map(c => (
                <tr key={c.id} className="text-sm">
                  <td className="px-6 py-4 text-gray-500">{c.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{c.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-red-600">- Rp {c.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteCost(c.id)} className="text-gray-400 hover:text-red-600">&times;</button>
                  </td>
                </tr>
              ))}
              {costs.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-400">Belum ada pengeluaran diinput.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Input Biaya Operasional</h3>
            <form onSubmit={handleSaveCost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal</label>
                <input required type="date" className="w-full px-4 py-2 border rounded-lg" value={newCost.date} onChange={e => setNewCost({...newCost, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Deskripsi</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Bensin, Parkir, dll" value={newCost.description} onChange={e => setNewCost({...newCost, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Kategori</label>
                <select className="w-full px-4 py-2 border rounded-lg" value={newCost.category} onChange={e => setNewCost({...newCost, category: e.target.value as any})}>
                  <option value="Bensin">Bensin</option>
                  <option value="Parkir">Parkir</option>
                  <option value="Tip Guide">Tip Guide</option>
                  <option value="Tiket Masuk">Tiket Masuk</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Jumlah (Rp)</label>
                <input required type="number" className="w-full px-4 py-2 border rounded-lg" value={newCost.amount} onChange={e => setNewCost({...newCost, amount: Number(e.target.value)})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border rounded-lg text-gray-600 font-bold">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
