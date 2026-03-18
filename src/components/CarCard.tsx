import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Settings, Calendar, ChevronLeft } from 'lucide-react';
import { Car } from '../types';
import { motion } from 'motion/react';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={car.images[0] || 'https://picsum.photos/seed/car/800/600'}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {car.featured && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-zinc-950 text-xs font-bold rounded-full shadow-lg">
            مميز
          </div>
        )}
        {car.urgencyLabel && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
            {car.urgencyLabel}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">
            {car.title}
          </h3>
          <span className="text-lg font-bold text-amber-500">
            {car.price.toLocaleString()} ج.م
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Calendar size={16} className="text-amber-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Gauge size={16} className="text-amber-500" />
            <span>{car.mileage.toLocaleString()} كم</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Fuel size={16} className="text-amber-500" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Settings size={16} className="text-amber-500" />
            <span>{car.transmission}</span>
          </div>
        </div>

        <Link
          to={`/cars/${car.id}`}
          className="btn-secondary w-full flex items-center justify-center gap-2 py-2 group-hover:bg-amber-500 group-hover:text-zinc-950 group-hover:border-amber-500 transition-all"
        >
          عرض التفاصيل
          <ChevronLeft size={18} />
        </Link>
      </div>
    </motion.div>
  );
};

export default CarCard;
