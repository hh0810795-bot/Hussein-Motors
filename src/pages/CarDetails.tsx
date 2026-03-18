import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Car } from '../types';
import { 
  Fuel, Gauge, Settings, Calendar, ChevronRight, 
  Share2, Download, Copy, MessageCircle, ArrowRight,
  CheckCircle2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LeadForm from '../components/LeadForm';
import { toast } from 'react-hot-toast';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'cars', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setCar({ id: snapshot.id, ...snapshot.data() } as Car);
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const copyDescription = () => {
    if (!car) return;
    const text = `${car.title}\nالسعر: ${car.price.toLocaleString()} ج.م\nالموديل: ${car.year}\nالممشى: ${car.mileage.toLocaleString()} كم\n\n${car.description}`;
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ الوصف بنجاح');
  };

  const downloadImages = () => {
    if (!car) return;
    // In a real app, this would trigger a ZIP download or individual downloads
    toast.success('بدء تحميل الصور...');
    car.images.forEach((img, i) => {
      const link = document.createElement('a');
      link.href = img;
      link.download = `${car.title}-${i + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-12 animate-pulse">
        <div className="h-96 bg-zinc-900 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="h-12 w-1/2 bg-zinc-900 rounded-xl" />
            <div className="h-48 bg-zinc-900 rounded-xl" />
          </div>
          <div className="h-96 bg-zinc-900 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center space-y-6">
        <h2 className="text-3xl font-bold">السيارة غير موجودة</h2>
        <p className="text-zinc-500">عذراً، لم نتمكن من العثور على السيارة التي تبحث عنها.</p>
        <Link to="/cars" className="btn-primary inline-block">العودة لتصفح السيارات</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link to="/" className="hover:text-amber-500">الرئيسية</Link>
        <ChevronRight size={14} />
        <Link to="/cars" className="hover:text-amber-500">السيارات</Link>
        <ChevronRight size={14} />
        <span className="text-zinc-300">{car.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Gallery & Info */}
        <div className="lg:col-span-2 space-y-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div 
              className="relative aspect-video rounded-3xl overflow-hidden cursor-zoom-in group"
              onClick={() => setShowLightbox(true)}
            >
              <img
                src={car.images[activeImage] || 'https://picsum.photos/seed/car/1200/800'}
                alt={car.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-full">
                  <Share2 size={24} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 md:grid-cols-8 gap-4">
              {car.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-amber-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${car.title} ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: 'السنة', value: car.year },
              { icon: Gauge, label: 'الممشى', value: `${car.mileage.toLocaleString()} كم` },
              { icon: Fuel, label: 'الوقود', value: car.fuel },
              { icon: Settings, label: 'ناقل الحركة', value: car.transmission },
            ].map((spec, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center space-y-2">
                <spec.icon className="mx-auto text-amber-500" size={24} />
                <p className="text-xs text-zinc-500">{spec.label}</p>
                <p className="font-bold">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">وصف السيارة</h2>
              <button 
                onClick={copyDescription}
                className="text-amber-500 hover:text-amber-400 flex items-center gap-2 text-sm"
              >
                <Copy size={16} />
                نسخ الوصف
              </button>
            </div>
            <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
              {car.description}
            </p>
            
            {car.extras.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="font-bold flex items-center gap-2">
                  <Info size={18} className="text-amber-500" />
                  إضافات ومميزات
                </h3>
                <div className="flex flex-wrap gap-3">
                  {car.extras.map((extra, i) => (
                    <span key={i} className="px-4 py-2 bg-zinc-900 rounded-full text-sm text-zinc-300 border border-white/5">
                      {extra}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={downloadImages}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={20} />
              تحميل جميع الصور
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Share2 size={20} />
              مشاركة
            </button>
          </div>
        </div>

        {/* Right: Sidebar Actions */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl space-y-6 sticky top-24">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{car.title}</h1>
              <p className="text-zinc-500">{car.brand} • {car.year}</p>
            </div>
            
            <div className="text-4xl font-black text-amber-500">
              {car.price.toLocaleString()} ج.م
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <a 
                href={`https://wa.me/201101751494?text=أنا مهتم بسيارة ${car.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
              >
                <MessageCircle size={24} />
                تواصل عبر واتساب
              </a>
            </div>

            <LeadForm car={car} />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-amber-500 transition-colors">
              <ArrowRight size={32} />
            </button>
            <img
              src={car.images[activeImage]}
              alt={car.title}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarDetails;
