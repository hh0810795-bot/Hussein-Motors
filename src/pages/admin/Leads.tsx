import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Lead, LeadStatus } from '../../types';
import { 
  Search, Filter, Trash2, Edit2, Loader2, 
  Phone, Mail, MessageSquare, ExternalLink,
  ChevronDown, CheckCircle2, XCircle, Clock, ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LEAD_STATUSES, STATUS_COLORS } from '../../constants';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status: newStatus });
      toast.success('تم تحديث الحالة');
      fetchLeads();
    } catch (error) {
      toast.error('حدث خطأ أثناء التحديث');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
      toast.success('تم حذف الطلب');
      fetchLeads();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.carTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'الكل' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">إدارة <span className="text-amber-500">الطلبات</span></h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث بالاسم، الهاتف، أو السيارة..."
              className="input pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
          <select 
            className="input md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="الكل">جميع الحالات</option>
            {LEAD_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-amber-500" size={48} />
        </div>
      ) : filteredLeads.length > 0 ? (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white/5 text-zinc-400 text-sm">
                  <th className="p-6">العميل</th>
                  <th className="p-6">السيارة</th>
                  <th className="p-6">الميزانية</th>
                  <th className="p-6">المسوق</th>
                  <th className="p-6">الحالة</th>
                  <th className="p-6">التاريخ</th>
                  <th className="p-6">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="font-bold">{lead.clientName}</p>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <a href={`tel:${lead.phone}`} className="hover:text-amber-500 flex items-center gap-1">
                            <Phone size={12} />
                            {lead.phone}
                          </a>
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="hover:text-amber-500 flex items-center gap-1">
                              <Mail size={12} />
                              {lead.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-medium">{lead.carTitle}</p>
                      <Link to={`/cars/${lead.carId}`} className="text-xs text-amber-500 hover:underline flex items-center gap-1">
                        عرض السيارة
                        <ExternalLink size={10} />
                      </Link>
                    </td>
                    <td className="p-6 text-zinc-300 font-bold">{lead.budget.toLocaleString()} ريال</td>
                    <td className="p-6">
                      <p className="text-sm">{lead.marketerName}</p>
                      <p className="text-xs text-zinc-500">ID: {lead.marketerId.slice(0, 8)}</p>
                    </td>
                    <td className="p-6">
                      <div className="relative group/status">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer flex items-center gap-2 w-fit ${STATUS_COLORS[lead.status]}`}>
                          {lead.status}
                          <ChevronDown size={12} />
                        </span>
                        <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 p-2 space-y-1">
                          {LEAD_STATUSES.map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(lead.id, status)}
                              className={`w-full text-right px-3 py-2 rounded-lg text-xs hover:bg-white/5 transition-colors ${lead.status === status ? 'text-amber-500 font-bold' : 'text-zinc-400'}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-zinc-500 text-sm">
                      {format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <a 
                          href={`https://wa.me/${lead.phone.replace(/\s/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-500 hover:text-emerald-500 transition-colors"
                        >
                          <MessageSquare size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 space-y-4 glass rounded-3xl">
          <ClipboardList size={48} className="mx-auto text-zinc-800" />
          <h3 className="text-xl font-bold">لا توجد طلبات</h3>
          <p className="text-zinc-500">لم يتم العثور على أي طلبات تطابق معايير البحث</p>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
