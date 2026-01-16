
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { dataService } from '../services/dataService';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(dataService.getSettings());
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.saveSettings(settings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h2>
        <p className="text-gray-500 text-sm">Konfigurasi profil perusahaan dan pengaturan umum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
           <h3 className="text-lg font-bold text-gray-800">Profil Perusahaan</h3>
           <p className="text-sm text-gray-500">Informasi ini akan muncul di invoice dan dokumen resmi.</p>
        </div>
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-6">
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 text-sm font-bold">
                  Pengaturan berhasil disimpan!
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Perusahaan</label>
                  <input required type="text" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Deskripsi Singkat</label>
                  <input required type="text" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500" value={settings.description} onChange={e => setSettings({...settings, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Alamat Kantor</label>
                  <textarea rows={3} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Kontak Resmi (WhatsApp/Phone)</label>
                  <input required type="text" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500" value={settings.contact} onChange={e => setSettings({...settings, contact: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mata Uang</label>
                    <input disabled type="text" className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-400" value={settings.currency} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Zona Waktu</label>
                    <input disabled type="text" className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-400" value="WIB (Asia/Jakarta)" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-gray-800">Manajemen Pengguna</h3>
            <p className="text-sm text-gray-500">Ubah hak akses atau password staf.</p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
               <div className="flex justify-between items-center py-4 border-b">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">A</div>
                   <div>
                     <p className="font-bold text-gray-900">Administrator</p>
                     <p className="text-xs text-gray-500">Akses Penuh</p>
                   </div>
                 </div>
                 <button className="text-xs text-indigo-600 font-bold hover:underline">Ubah Password</button>
               </div>
               <div className="flex justify-between items-center py-4">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">K</div>
                   <div>
                     <p className="font-bold text-gray-900">Kasir Utama</p>
                     <p className="text-xs text-gray-500">Input & Transaksi</p>
                   </div>
                 </div>
                 <button className="text-xs text-indigo-600 font-bold hover:underline">Ubah Password</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
