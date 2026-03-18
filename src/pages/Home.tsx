import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Shield, Clock, Zap, Star } from 'lucide-react';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Car } from '../types';
import CarCard from '../components/CarCard';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, 'cars'),
          where('featured', '==', true),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
        setFeaturedCars(cars);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
            alt="Luxury Car"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-tight italic uppercase"
          >
            Hussein <span className="gradient-text">Motors</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium tracking-wide"
          >
            التميز في عالم السيارات الفاخرة. نضع بين يديك نخبة من أرقى العلامات التجارية العالمية في قلب مصر.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="ابحث عن سيارة أحلامك..."
                className="input pr-12 py-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
            <Link to="/cars" className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
              تصفح الكل
              <ArrowLeft size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: Star, title: 'جودة مضمونة', desc: 'فحص شامل لكل سيارة' },
          { icon: Shield, title: 'أمان تام', desc: 'ضمانات حقيقية وموثقة' },
          { icon: Clock, title: 'سرعة الإجراءات', desc: 'ننهي معاملاتك في دقائق' },
          { icon: Zap, title: 'أفضل الأسعار', desc: 'عروض حصرية ومنافسة' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl text-center space-y-4 hover:border-amber-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all">
              <feature.icon size={24} />
            </div>
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="text-zinc-500 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">سيارات <span className="text-amber-500">مختارة</span></h2>
            <p className="text-zinc-500">أحدث وأفضل العروض المتوفرة حالياً</p>
          </div>
          <Link to="/cars" className="text-amber-500 hover:underline flex items-center gap-1">
            مشاهدة الكل
            <ArrowLeft size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="card h-96 animate-pulse bg-zinc-900/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative rounded-3xl overflow-hidden h-96 flex items-center p-8 md:p-16">
          <img
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1920"
            alt="Promo"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent" />
          
          <div className="relative z-10 max-w-xl space-y-6">
            <h2 className="text-4xl font-bold leading-tight">انضم إلى فريق <span className="text-amber-500">المسوقين</span> لدينا وابدأ بجني الأرباح</h2>
            <p className="text-zinc-300">نقدم لك أفضل نظام عمولات في السوق مع لوحة تحكم متكاملة لمتابعة مبيعاتك وأرباحك.</p>
            <Link to="/register" className="btn-primary inline-block">سجل كمسوق الآن</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
