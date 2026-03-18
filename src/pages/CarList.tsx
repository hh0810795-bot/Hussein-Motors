import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Car } from '../types';
import CarCard from '../components/CarCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { BRANDS, FUEL_TYPES, TRANSMISSIONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('الكل');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
        
        if (selectedBrand !== 'الكل') {
          q = query(collection(db, 'cars'), where('brand', '==', selectedBrand), orderBy('createdAt', 'desc'));
        }

        const snapshot = await getDocs(q);
        let carsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));

        // Client-side search and sorting
        if (searchQuery) {
          carsData = carsData.filter(car => 
            car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.brand.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (sortBy === 'price-low') {
          carsData.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          carsData.sort((a, b) => b.price - a.price);
        }

        setCars(carsData);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [selectedBrand, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <h1 className="text-4xl font-bold">تصفح <span className="text-amber-500">السيارات</span></h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث بالاسم أو الماركة..."
              className="input pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <SlidersHorizontal size={20} />
            تصفية
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">الماركة</label>
                <select 
                  className="input"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="الكل">الكل</option>
                  {BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">الترتيب حسب</label>
                <select 
                  className="input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">الأحدث أولاً</option>
                  <option value="price-low">السعر: من الأقل للأعلى</option>
                  <option value="price-high">السعر: من الأعلى للأقل</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card h-96 animate-pulse bg-zinc-900/50" />
          ))}
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 space-y-4">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
            <Search size={32} className="text-zinc-700" />
          </div>
          <h3 className="text-xl font-bold">لا توجد نتائج</h3>
          <p className="text-zinc-500">حاول تغيير معايير البحث أو التصفية</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedBrand('الكل');
              setSortBy('newest');
            }}
            className="text-amber-500 hover:underline"
          >
            إعادة تعيين الكل
          </button>
        </div>
      )}
    </div>
  );
};

export default CarList;
