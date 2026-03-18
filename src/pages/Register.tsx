import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Phone, Wallet, Loader2, ArrowLeft } from 'lucide-react';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const marketerData = {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        cashNumber: data.cashNumber,
        totalLeads: 0,
        confirmedDeals: 0,
        paidCommissions: 0,
        remainingCommissions: 0,
        targetProgress: 0,
        role: 'marketer',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'marketers', user.uid), marketerData);
      
      // Add notification for admin
      await setDoc(doc(db, 'notifications', `new_marketer_${user.uid}`), {
        userId: 'admin',
        message: `مسوق جديد سجل في المنصة: ${data.fullName}`,
        read: false,
        createdAt: new Date().toISOString(),
      });

      toast.success('تم إنشاء الحساب بنجاح! مرحباً بك في فريقنا.');
      navigate('/marketer');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('البريد الإلكتروني مستخدم بالفعل');
      } else {
        toast.error('حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass p-8 md:p-12 rounded-3xl w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">انضم إلى <span className="text-amber-500">فريقنا</span></h1>
          <p className="text-zinc-500">سجل كمسوق وابدأ بجني الأرباح اليوم</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">الاسم الكامل</label>
              <div className="relative">
                <input
                  {...register('fullName', { required: 'الاسم مطلوب' })}
                  placeholder="أدخل اسمك الكامل"
                  className="input pr-12"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-400">رقم الهاتف</label>
              <div className="relative">
                <input
                  {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                  placeholder="05xxxxxxxx"
                  className="input pr-12"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message as string}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-400">البريد الإلكتروني</label>
            <div className="relative">
              <input
                {...register('email', { required: 'البريد الإلكتروني مطلوب' })}
                type="email"
                placeholder="example@mail.com"
                className="input pr-12"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">كلمة المرور</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'كلمة المرور مطلوبة', minLength: { value: 6, message: '6 أحرف على الأقل' } })}
                  type="password"
                  placeholder="••••••••"
                  className="input pr-12"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-400">رقم الكاش (لاستلام العمولات)</label>
              <div className="relative">
                <input
                  {...register('cashNumber', { required: 'رقم الكاش مطلوب' })}
                  placeholder="رقم المحفظة الإلكترونية"
                  className="input pr-12"
                />
                <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              </div>
              {errors.cashNumber && <p className="text-red-500 text-xs">{errors.cashNumber.message as string}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                إنشاء حساب
                <UserPlus size={20} />
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-zinc-500 text-sm">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-amber-500 hover:underline">سجل دخولك</Link>
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
