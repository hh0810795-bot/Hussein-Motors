import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Lead, Marketer, Car } from '../../types';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Users, CheckCircle2, Clock, DollarSign, 
  Car as CarIcon, ClipboardList, TrendingUp,
  ArrowLeft, PlusCircle, Loader2
} from 'lucide-react';
import { STATUS_COLORS } from '../../constants';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import { seedData } from '../../utils/seed';

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [carsCount, setCarsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    const success = await seedData();
    if (success) {
      toast.success('تمت إضافة البيانات التجريبية بنجاح');
      window.location.reload();
    } else {
      toast.error('حدث خطأ أثناء إضافة البيانات');
    }
    setSeeding(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent leads
        const leadsQ = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));
        const leadsSnapshot = await getDocs(leadsQ);
        setLeads(leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));

        // Fetch marketers
        const marketersQ = query(collection(db, 'marketers'), orderBy('totalLeads', 'desc'), limit(5));
        const marketersSnapshot = await getDocs(marketersQ);
        setMarketers(marketersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Marketer)));

        // Fetch cars count
        const carsSnapshot = await getDocs(collection(db, 'cars'));
        setCarsCount(carsSnapshot.size);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'إجمالي السيارات', value: carsCount, icon: CarIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'إجمالي الطلبات', value: leads.length, icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'المسوقين النشطين', value: marketers.length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'إجمالي المبيعات', value: '1.2M ريال', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const chartData = [
    { name: 'يناير', leads: 40, sales: 24 },
    { name: 'فبراير', leads: 30, sales: 13 },
    { name: 'مارس', leads: 20, sales: 98 },
    { name: 'أبريل', leads: 27, sales: 39 },
    { name: 'مايو', leads: 18, sales: 48 },
    { name: 'يونيو', leads: 23, sales: 38 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">لوحة <span className="text-amber-500">التحكم</span></h1>
          <p className="text-zinc-500">نظرة عامة على أداء المنصة</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="btn-secondary flex items-center gap-2"
          >
            {seeding ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
            إضافة بيانات تجريبية
          </button>
          <Link to="/admin/cars" className="btn-primary flex items-center gap-2">
            <PlusCircle size={20} />
            إضافة سيارة
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold">تحليلات الأداء</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Bar dataKey="leads" fill="#f59e0b" radius={[4, 4, 0, 0]} name="الطلبات" />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name="المبيعات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Marketers */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold">أفضل المسوقين</h2>
          <div className="space-y-6">
            {marketers.map((marketer, i) => (
              <div key={marketer.uid} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-amber-500">
                    {marketer.fullName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{marketer.fullName}</p>
                    <p className="text-xs text-zinc-500">{marketer.totalLeads} طلب</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-emerald-500">{marketer.confirmedDeals} صفقات</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-secondary w-full py-2 text-sm">عرض جميع المسوقين</button>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">أحدث الطلبات</h2>
          <button className="text-amber-500 hover:underline text-sm">عرض الكل</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 text-zinc-400 text-sm">
                <th className="p-4">العميل</th>
                <th className="p-4">السيارة</th>
                <th className="p-4">المسوق</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{lead.clientName}</td>
                  <td className="p-4 text-zinc-400">{lead.carTitle}</td>
                  <td className="p-4 text-zinc-400">{lead.marketerName}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500 text-sm">
                    {format(new Date(lead.createdAt), 'dd/MM/yyyy', { locale: ar })}
                  </td>
                  <td className="p-4">
                    <button className="text-amber-500 hover:underline text-sm">تعديل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
