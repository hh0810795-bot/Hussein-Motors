import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Lead, Notification } from '../../types';
import { 
  Users, CheckCircle2, Clock, DollarSign, 
  TrendingUp, Bell, ArrowLeft, PlusCircle,
  Search, Filter
} from 'lucide-react';
import { STATUS_COLORS } from '../../constants';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const MarketerDashboard: React.FC = () => {
  const { marketerData, user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch recent leads
        const leadsQ = query(
          collection(db, 'leads'),
          where('marketerId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const leadsSnapshot = await getDocs(leadsQ);
        setLeads(leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));

        // Fetch unread notifications
        const notifsQ = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          where('read', '==', false),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const notifsSnapshot = await getDocs(notifsQ);
        setNotifications(notifsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const stats = [
    { label: 'إجمالي العملاء', value: marketerData?.totalLeads || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'الصفقات المؤكدة', value: marketerData?.confirmedDeals || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'عمولات مدفوعة', value: `${marketerData?.paidCommissions || 0} ريال`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'عمولات متبقية', value: `${marketerData?.remainingCommissions || 0} ريال`, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">أهلاً، <span className="text-amber-500">{marketerData?.fullName}</span></h1>
          <p className="text-zinc-500">إليك ملخص لأدائك اليوم</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary flex items-center gap-2">
            <Bell size={20} />
            الإشعارات ({notifications.length})
          </button>
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
        {/* Recent Leads */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">أحدث العملاء</h2>
            <button className="text-amber-500 hover:underline text-sm flex items-center gap-1">
              مشاهدة الكل
              <ArrowLeft size={14} />
            </button>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />)}
              </div>
            ) : leads.length > 0 ? (
              <div className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-amber-500">
                        {lead.clientName[0]}
                      </div>
                      <div>
                        <p className="font-bold">{lead.clientName}</p>
                        <p className="text-sm text-zinc-500">{lead.carTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-left hidden md:block">
                        <p className="text-sm font-medium">{lead.budget.toLocaleString()} ريال</p>
                        <p className="text-xs text-zinc-500">{format(new Date(lead.createdAt), 'dd MMM yyyy', { locale: ar })}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <Users size={48} className="mx-auto text-zinc-700" />
                <p className="text-zinc-500">لا يوجد عملاء حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Target Progress */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">الهدف الشهري</h2>
          <div className="glass p-8 rounded-3xl space-y-8">
            <div className="text-center space-y-2">
              <p className="text-sm text-zinc-500">تقدمك نحو المكافأة القادمة</p>
              <p className="text-4xl font-black text-amber-500">{marketerData?.targetProgress || 0}%</p>
            </div>
            
            <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${marketerData?.targetProgress || 0}%` }}
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">المكافأة القادمة:</span>
                <span className="font-bold text-emerald-500">500 ريال</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">المتبقي للهدف:</span>
                <span className="font-bold">3 صفقات</span>
              </div>
            </div>

            <button className="btn-secondary w-full py-2 text-sm">عرض نظام المكافآت</button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="glass p-4 rounded-2xl text-center space-y-2 hover:border-amber-500/50 transition-all">
              <PlusCircle className="mx-auto text-amber-500" />
              <p className="text-xs font-bold">إضافة عميل</p>
            </button>
            <button className="glass p-4 rounded-2xl text-center space-y-2 hover:border-amber-500/50 transition-all">
              <TrendingUp className="mx-auto text-amber-500" />
              <p className="text-xs font-bold">التقارير</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketerDashboard;
