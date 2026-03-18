import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Marketer } from '../../types';
import { 
  Users, Search, Filter, Trash2, Edit2, Loader2, 
  Phone, Mail, Wallet, TrendingUp, DollarSign,
  CheckCircle2, Clock, Target, Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AdminMarketers: React.FC = () => {
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMarketers();
  }, []);

  const fetchMarketers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'marketers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setMarketers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Marketer)));
    } catch (error) {
      console.error('Error fetching marketers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommission = async (uid: string, field: 'paidCommissions' | 'remainingCommissions', amount: number) => {
    try {
      await updateDoc(doc(db, 'marketers', uid), { [field]: amount });
      toast.success('تم تحديث العمولة');
      fetchMarketers();
    } catch (error) {
      toast.error('حدث خطأ أثناء التحديث');
    }
  };

  const handleDelete = async (uid: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المسوق؟')) return;
    try {
      await deleteDoc(doc(db, 'marketers', uid));
      toast.success('تم حذف المسوق');
      fetchMarketers();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const filteredMarketers = marketers.filter(m => 
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">إدارة <span className="text-amber-500">المسوقين</span></h1>
        
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ابحث بالاسم، الهاتف، أو البريد..."
            className="input pr-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-amber-500" size={48} />
        </div>
      ) : filteredMarketers.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredMarketers.map((marketer) => (
            <div key={marketer.uid} className="glass p-8 rounded-3xl space-y-6 group hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-2xl text-amber-500">
                    {marketer.fullName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{marketer.fullName}</h3>
                    <p className="text-sm text-zinc-500">{marketer.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Phone size={12} /> {marketer.phone}</span>
                      <span className="flex items-center gap-1"><Wallet size={12} /> {marketer.cashNumber}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(marketer.uid)}
                  className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
                <div className="text-center space-y-1">
                  <p className="text-xs text-zinc-500">إجمالي الطلبات</p>
                  <p className="text-lg font-bold">{marketer.totalLeads}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-zinc-500">الصفقات</p>
                  <p className="text-lg font-bold text-emerald-500">{marketer.confirmedDeals}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-zinc-500">الهدف</p>
                  <p className="text-lg font-bold text-amber-500">{marketer.targetProgress}%</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex gap-8">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">عمولات مدفوعة</p>
                    <p className="font-bold text-emerald-500">{marketer.paidCommissions.toLocaleString()} ريال</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">عمولات متبقية</p>
                    <p className="font-bold text-amber-500">{marketer.remainingCommissions.toLocaleString()} ريال</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2">
                    <DollarSign size={14} />
                    صرف عمولة
                  </button>
                  <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2">
                    <Award size={14} />
                    مكافأة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 space-y-4 glass rounded-3xl">
          <Users size={48} className="mx-auto text-zinc-800" />
          <h3 className="text-xl font-bold">لا يوجد مسوقين</h3>
          <p className="text-zinc-500">لم يتم العثور على أي مسوقين حالياً</p>
        </div>
      )}
    </div>
  );
};

export default AdminMarketers;
