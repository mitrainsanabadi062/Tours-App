
import React, { useState, useEffect } from 'react';
import { TourPackage, Category, SubCategory, User } from '../types';
import { dataService } from '../services/dataService';

interface PackagesProps {
  user: User;
}

const Packages: React.FC<PackagesProps> = ({ user }) => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<TourPackage>>({
    name: '',
    category: Category.DOMESTIC,
    subCategory: SubCategory.NATURE,
    destination: '',
    duration: '',
    priceAdult: 0,
    priceChild: 0,
    priceVip: 0,
    isWeekday: true,
    isWeekend: false,
    facilities: []
  });

  useEffect(() => {
    setPackages(dataService.getPackages());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedPackages: TourPackage[];
    if (editingPackage) {
      updatedPackages = packages.map(p => p.id === editingPackage.id ? { ...editingPackage, ...formData } as TourPackage : p);
    } else {
      const newPkg = { ...formData, id: Date.now().toString(), quotaPerDate: {} } as TourPackage;
      updatedPackages = [...packages, newPkg];
    }
    setPackages(updatedPackages);
    dataService.savePackages(updatedPackages);
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus paket ini?')) {
      const updated = packages.filter(p => p.id !== id);
      setPackages(updated);
      dataService.savePackages(updated);
    }
  };

  const openEdit = (pkg: TourPackage) => {
    if (user.role !== 'admin') return;
    setEditingPackage(pkg);
    setFormData(pkg);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      category: Category.DOMESTIC,
      subCategory: SubCategory.NATURE,
      destination: '',
      duration: '',
      priceAdult: 0,
      priceChild: 0,
      priceVip: 0,
      isWeekday: true,
      isWeekend: false,
      facilities: []
    });
  };

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Paket Wisata</h2>
          <p className="text-gray-500 text-sm">Kelola katalog perjalanan Anda di sini.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Cari paket..." 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 flex-1 md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {user.role === 'admin' && (
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shrink-0"
            >
              <svg className="w-5 h-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden md:inline">Tambah Paket</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="h-40 bg-indigo-50 flex items-center justify-center relative">
               <div className="text-indigo-200 uppercase font-black text-4xl opacity-50 select-none">{pkg.subCategory.split(' ')[0]}</div>
               <span className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${
                pkg.category === Category.DOMESTIC ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
              }`}>
                {pkg.category}
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded">{pkg.subCategory}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{pkg.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {pkg.destination} • {pkg.duration}
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Dewasa</span>
                  <span className="font-bold text-gray-900">Rp {pkg.priceAdult.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Anak</span>
                  <span className="font-bold text-gray-900">Rp {pkg.priceChild.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-indigo-700 font-black">
                  <span>VIP</span>
                  <span>Rp {pkg.priceVip.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-[10px] text-gray-400 mb-6 font-medium">
                <span className={`flex items-center ${pkg.isWeekday ? 'text-indigo-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${pkg.isWeekday ? 'bg-indigo-600' : 'bg-gray-300'}`}></div> Weekday
                </span>
                <span className={`flex items-center ${pkg.isWeekend ? 'text-indigo-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${pkg.isWeekend ? 'bg-indigo-600' : 'bg-gray-300'}`}></div> Weekend
                </span>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => openEdit(pkg)}
                  disabled={user.role !== 'admin'}
                  className="flex-1 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition"
                >
                  {user.role === 'admin' ? 'Edit Details' : 'View Details'}
                </button>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold">{editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tour</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}>
                    <option value={Category.DOMESTIC}>Domestik</option>
                    <option value={Category.INTERNATIONAL}>Luar Negeri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Kategori</label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={formData.subCategory} onChange={(e) => setFormData({ ...formData, subCategory: e.target.value as SubCategory })}>
                    {Object.values(SubCategory).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinasi</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                  <input required type="text" placeholder="Contoh: 3H2M" className="w-full px-4 py-2 border rounded-lg" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Dewasa</label>
                  <input required type="number" className="w-full px-4 py-2 border rounded-lg" value={formData.priceAdult} onChange={(e) => setFormData({ ...formData, priceAdult: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Anak</label>
                  <input required type="number" className="w-full px-4 py-2 border rounded-lg" value={formData.priceChild} onChange={(e) => setFormData({ ...formData, priceChild: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga VIP</label>
                  <input required type="number" className="w-full px-4 py-2 border rounded-lg" value={formData.priceVip} onChange={(e) => setFormData({ ...formData, priceVip: Number(e.target.value) })} />
                </div>
                <div className="flex items-center space-x-6 py-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 rounded text-indigo-600" checked={formData.isWeekday} onChange={(e) => setFormData({ ...formData, isWeekday: e.target.checked })} /> Weekday
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 rounded text-indigo-600" checked={formData.isWeekend} onChange={(e) => setFormData({ ...formData, isWeekend: e.target.checked })} /> Weekend
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Simpan Paket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
