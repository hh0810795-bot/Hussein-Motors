import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { ADMIN_EMAIL } from '../constants';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast.success('تم تسجيل الدخول بنجاح');
      
      if (result.user.email === ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        navigate('/marketer');
      }
    } catch (error: any) {
      console.error('Google Login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول عبر جوجل');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('تم تسجيل الدخول بنجاح');
      
      if (data.email === ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        navigate('/marketer');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error('يرجى تفعيل "Email/Password" من لوحة تحكم Firebase');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        toast.error('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني أولاً');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الرابط');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass p-8 md:p-12 rounded-3xl w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">مرحباً <span className="text-amber-500">بعودتك</span></h1>
          <p className="text-zinc-500">سجل دخولك لمتابعة أعمالك</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl transition-all font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          دخول سريع عبر جوجل
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-4 text-zinc-500 font-bold">أو عبر البريد</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm text-zinc-400">كلمة المرور</label>
              <button 
                type="button"
                onClick={handleResetPassword}
                className="text-xs text-amber-500 hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <div className="relative">
              <input
                {...register('password', { required: 'كلمة المرور مطلوبة' })}
                type="password"
                placeholder="••••••••"
                className="input pr-12"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
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
                دخول
                <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-zinc-500 text-sm">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-amber-500 hover:underline">سجل كمسوق الآن</Link>
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

export default Login;
