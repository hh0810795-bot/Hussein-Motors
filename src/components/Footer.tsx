import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-2 bg-zinc-900 border border-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <Car className="text-amber-500 w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black tracking-tighter uppercase italic">
                Hussein <span className="text-amber-500">Motors</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Premium Cars</span>
            </div>
          </Link>
          <p className="text-zinc-400 leading-relaxed">
            منصتكم الموثوقة لبيع وشراء السيارات الفاخرة في الوطن العربي. جودة، أمان، وسرعة في التعامل.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=61579472812795" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-lg hover:bg-amber-500 hover:text-zinc-950 transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-amber-500 hover:text-zinc-950 transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-amber-500 hover:text-zinc-950 transition-all">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">روابط سريعة</h3>
          <ul className="space-y-4">
            <li><Link to="/" className="text-zinc-400 hover:text-amber-500 transition-colors">الرئيسية</Link></li>
            <li><Link to="/cars" className="text-zinc-400 hover:text-amber-500 transition-colors">تصفح السيارات</Link></li>
            <li><Link to="/about" className="text-zinc-400 hover:text-amber-500 transition-colors">من نحن</Link></li>
            <li><Link to="/contact" className="text-zinc-400 hover:text-amber-500 transition-colors">اتصل بنا</Link></li>
            <li><Link to="/login" className="text-zinc-400 hover:text-amber-500 transition-colors text-xs opacity-50">دخول الإدارة</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">تواصل معنا</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-zinc-400">
              <Phone size={18} className="text-amber-500" />
              <span>01101751494</span>
            </li>
            <li className="flex items-center gap-3 text-zinc-400">
              <Mail size={18} className="text-amber-500" />
              <span>hh0810795@gmail.com</span>
            </li>
            <li className="flex items-center gap-3 text-zinc-400">
              <MapPin size={18} className="text-amber-500" />
              <span>القاهرة، مصر</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">النشرة الإخبارية</h3>
          <p className="text-zinc-400 mb-4">اشترك لتصلك أحدث العروض والسيارات المضافة.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني" 
              className="input py-2"
            />
            <button className="btn-primary py-2 px-4">اشترك</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} حسين موتورز. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
