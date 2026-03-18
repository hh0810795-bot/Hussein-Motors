import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Car, Lead } from '../types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

interface LeadFormProps {
  car: Car;
  onSuccess?: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ car, onSuccess }) => {
  const { user, marketerData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Lead>>();

  const onSubmit = async (data: Partial<Lead>) => {
    setIsSubmitting(true);
    try {
      const leadData = {
        ...data,
        carId: car.id,
        carTitle: car.title,
        status: 'جديد',
        marketerId: marketerData?.uid || 'direct',
        marketerName: marketerData?.fullName || 'مباشر',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'leads'), leadData);
      
      // Also add a notification for admin
      await addDoc(collection(db, 'notifications'), {
        userId: 'admin',
        message: `طلب جديد لسيارة ${car.title} من ${data.clientName}`,
        read: false,
        createdAt: new Date().toISOString(),
      });

      setSubmitted(true);
      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass p-8 rounded-2xl text-center space-y-6 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold">شكراً لاهتمامك!</h3>
        <p className="text-zinc-400">تم استلام طلبك بنجاح. سيقوم أحد مستشارينا بالتواصل معك خلال 24 ساعة.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="btn-secondary w-full"
        >
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-2xl space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">مهتم بهذه السيارة؟</h3>
        <p className="text-zinc-400">املأ النموذج وسنتواصل معك في أقرب وقت.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">الاسم الكامل *</label>
          <input
            {...register('clientName', { required: 'الاسم مطلوب' })}
            placeholder="أدخل اسمك"
            className="input"
          />
          {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-zinc-400">رقم الهاتف *</label>
            <input
              {...register('phone', { required: 'رقم الهاتف مطلوب' })}
              placeholder="05xxxxxxxx"
              className="input"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-400">الميزانية المتوقعة *</label>
            <input
              type="number"
              {...register('budget', { required: 'الميزانية مطلوبة' })}
              placeholder="بالريال"
              className="input"
            />
            {errors.budget && <p className="text-red-500 text-xs">{errors.budget.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-400">البريد الإلكتروني (اختياري)</label>
          <input
            {...register('email')}
            type="email"
            placeholder="example@mail.com"
            className="input"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-400">رسالة إضافية (اختياري)</label>
          <textarea
            {...register('message')}
            placeholder="أي تفاصيل أخرى تود إخبارنا بها..."
            className="input min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              جاري الإرسال...
            </>
          ) : (
            <>
              إرسال الطلب
              <Send size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
