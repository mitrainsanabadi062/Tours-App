
import React, { useState, useEffect } from 'react';
import { Vendor } from '../types';
import { dataService } from '../services/dataService';

const VendorManager: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Partial<Vendor>>({
    name: '',
    type: 'Hotel',
    contact: '',
    commission: 0
  });

  useEffect(() => {
    setVendors(dataService.getVendors());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor = { ...currentVendor, id: currentVendor.id || Date.now().toString() } as Vendor;
    const updated = currentVendor.id ? vendors.map(v => v.id === currentVendor.id ? newVendor : v) : [...vendors, newVendor];
    setVendors(updated);
    dataService.saveVendors(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus vendor ini?')) {
      const updated = vendors.filter(v => v.id !== id);
      setVendors(updated);
      dataService.saveVendors(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Vendor</h2>
          <p className="text-gray-500 text-sm">Kelola jaringan hotel, transportasi, dan pemandu wisata.</p>
        </div>
        <button onClick={() => { setCurrentVendor({ name: '', type: 'Hotel', contact: '', commission: 0 }); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">+ Vendor Baru</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map(v => (
          <div key={v.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative group">
             <div className="flex justify-between items-start mb-4">
               <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase px-2 py-1 rounded">{v.type}</span>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => { setCurrentVendor(v); setIsModalOpen(true); }} className="text-blue-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                  <button onClick={() => handleDelete(v.id)} className="text-red-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
               </div>
             </div>
             <h3 className="font-bold text-gray-900 text-lg">{v.name}</h3>
             <p className="text-sm text-gray-500 mb-4">{v.contact}</p>
             <div className="flex justify-between items-center pt-3 border-t">
               <span className="text-xs text-gray-400 font-medium">Komisi:</span>
               <span className="font-bold text-green-600 text-sm">Rp {v.commission.toLocaleString()} / pax</span>
             </div>
          </div>
        ))}
        {vendors.length === 0 && <div className="col-span-3 py-10 text-center text-gray-400">Belum ada vendor terdaftar.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Informasi Vendor</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Bisnis</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={currentVendor.name} onChange={e => setCurrentVendor({...currentVendor, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Kategori</label>
                <select className="w-full px-4 py-2 border rounded-lg" value={currentVendor.type} onChange={e => setCurrentVendor({...currentVendor, type: e.target.value as any})}>
                  <option value="Hotel">Hotel</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Restoran">Restoran</option>
                  <option value="Tour Guide">Tour Guide</option>
                  <option value="Agen">Agen</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Kontak / Alamat</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={currentVendor.contact} onChange={e => setCurrentVendor({...currentVendor, contact: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Komisi per Pax (Rp)</label>
                <input required type="number" className="w-full px-4 py-2 border rounded-lg" value={currentVendor.commission} onChange={e => setCurrentVendor({...currentVendor, commission: Number(e.target.value)})} />
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

export default VendorManager;
