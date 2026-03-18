import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SAMPLE_CARS = [
  {
    title: 'مرسيدس بنز S-Class 2023',
    price: 550000,
    description: 'سيارة فاخرة بحالة الوكالة، كاملة المواصفات، جلد طبيعي، نظام صوتي برومستر، فتحة سقف بانوراما.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    year: 2023,
    mileage: 5000,
    fuel: 'بنزين',
    transmission: 'أوتوماتيك',
    extras: ['نظام ملاحة', 'كاميرا 360', 'رادار', 'تبريد مقاعد'],
    featured: true,
    brand: 'مرسيدس',
    createdAt: new Date().toISOString()
  },
  {
    title: 'بي ام دبليو M4 2022',
    price: 420000,
    description: 'سيارة رياضية قوية، لون أزرق مميز، مقاعد رياضية، صيانة دورية في الوكالة.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80&w=1200'
    ],
    year: 2022,
    mileage: 12000,
    fuel: 'بنزين',
    transmission: 'أوتوماتيك',
    extras: ['نظام صوتي هارمان كاردون', 'كربون فايبر', 'شاشة عرض'],
    featured: true,
    brand: 'بي ام دبليو',
    createdAt: new Date().toISOString()
  },
  {
    title: 'تويوتا لاند كروزر 2024',
    price: 380000,
    description: 'سيارة الدفع الرباعي الأقوى، مناسبة لجميع التضاريس، سعة 7 ركاب، ثلاجة داخلية.',
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200'
    ],
    year: 2024,
    mileage: 0,
    fuel: 'بنزين',
    transmission: 'أوتوماتيك',
    extras: ['دبل', 'فتحة سقف', 'شاشات خلفية'],
    featured: true,
    brand: 'تويوتا',
    createdAt: new Date().toISOString()
  }
];

export const seedData = async () => {
  try {
    for (const car of SAMPLE_CARS) {
      await addDoc(collection(db, 'cars'), car);
    }
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    return false;
  }
};
