import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Car } from '../../types';
import { Plus, Trash2, Edit2, Loader2, X, Image as ImageIcon, Check } from 'lucide-react';
import { BRANDS, FUEL_TYPES, TRANSMISSIONS } from '../../constants';
import { toast } from 'react-hot-toast';

const AdminCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    title: '',
    price: 0,
    description: '',
    images: [''],
    year: new Date().getFullYear(),
    mileage: 0,
    fuel: 'بنزين',
    transmission: 'أوتوماتيك',
    extras: [''],
    featured: false,
    brand: 'تويوتا'
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const path = 'cars';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setCars(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car)));
    } catch (error: any) {
      console.error('Error fetching cars:', error);
      
      const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
          isAnonymous: auth.currentUser?.isAnonymous,
          tenantId: auth.currentUser?.tenantId,
          providerInfo: auth.currentUser?.providerData.map(provider => ({
            providerId: provider.providerId,
            displayName: provider.displayName,
            email: provider.email,
            photoUrl: provider.photoURL
          })) || []
        },
        operationType: 'list',
        path
      };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
      toast.error('حدث خطأ أثناء تحميل السيارات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const path = 'cars';
    try {
      const carData = {
        ...formData,
        images: formData.images?.filter(img => img.trim() !== ''),
        extras: formData.extras?.filter(extra => extra.trim() !== ''),
        createdAt: formData.createdAt || new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, path, editingId), carData);
        toast.success('تم تحديث السيارة بنجاح');
      } else {
        await addDoc(collection(db, path), carData);
        toast.success('تمت إضافة السيارة بنجاح');
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        title: '',
        price: 0,
        description: '',
        images: [''],
        year: new Date().getFullYear(),
        mileage: 0,
        fuel: 'بنزين',
        transmission: 'أوتوماتيك',
        extras: [''],
        featured: false,
        brand: 'تويوتا'
      });
      fetchCars();
    } catch (error: any) {
      console.error('Error saving car:', error);
      
      const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
          isAnonymous: auth.currentUser?.isAnonymous,
          tenantId: auth.currentUser?.tenantId,
          providerInfo: auth.currentUser?.providerData.map(provider => ({
            providerId: provider.providerId,
            displayName: provider.displayName,
            email: provider.email,
            photoUrl: provider.photoURL
          })) || []
        },
        operationType: editingId ? 'update' : 'create',
        path: editingId ? `${path}/${editingId}` : path
      };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
      
      if (error.code === 'permission-denied' || error.message?.includes('insufficient permissions')) {
        toast.error('ليس لديك صلاحية للقيام بهذا الإجراء. تأكد من تسجيل الدخول كمسؤول.');
      } else {
        toast.error('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) return;
    const path = `cars/${id}`;
    try {
      await deleteDoc(doc(db, 'cars', id));
      toast.success('تم حذف السيارة بنجاح');
      fetchCars();
    } catch (error: any) {
      console.error('Error deleting car:', error);
      const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
          isAnonymous: auth.currentUser?.isAnonymous,
          tenantId: auth.currentUser?.tenantId,
          providerInfo: auth.currentUser?.providerData.map(provider => ({
            providerId: provider.providerId,
            displayName: provider.displayName,
            email: provider.email,
            photoUrl: provider.photoURL
          })) || []
        },
        operationType: 'delete',
        path
      };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
      toast.error('حدث خطأ أثناء الحذف. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleEdit = (car: Car) => {
    setEditingId(car.id);
    setFormData(car);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: '',
      price: 0,
      description: '',
      images: [''],
      year: new Date().getFullYear(),
      mileage: 0,
      fuel: 'بنزين',
      transmission: 'أوتوماتيك',
      extras: [''],
      featured: false,
      brand: 'تويوتا'
    });
  };

  const addImageField = () => setFormData({ ...formData, images: [...(formData.images || []), ''] });
  const addExtraField = () => setFormData({ ...formData, extras: [...(formData.extras || []), ''] });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة <span className="text-amber-500">السيارات</span></h1>
          <p className="text-zinc-500">إضافة وتعديل وحذف السيارات من المعرض</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          إضافة سيارة جديدة
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-amber-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="card group overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={car.images[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80'} 
                  alt={car.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={() => handleEdit(car)}
                    className="p-2 bg-black/50 backdrop-blur-md text-white rounded-lg hover:bg-amber-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(car.id)} 
                    className="p-2 bg-black/50 backdrop-blur-md text-white rounded-lg hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold">{car.title}</h3>
                <p className="text-amber-500 font-bold">{car.price.toLocaleString()} ج.م</p>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{car.brand}</span>
                  <span>{car.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Car Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="glass p-8 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-8 relative">
            <button 
              onClick={closeModal}
              className="absolute top-6 left-6 text-zinc-500 hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold">
              {editingId ? 'تعديل سيارة' : 'إضافة سيارة جديدة'}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-zinc-400">عنوان السيارة</label>
                  <input 
                    required
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-zinc-400">السعر</label>
                    <input 
                      required
                      type="number"
                      className="input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-zinc-400">الماركة</label>
                    <select 
                      className="input"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    >
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-zinc-400">السنة</label>
                    <input 
                      type="number"
                      className="input"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-zinc-400">الممشى</label>
                    <input 
                      type="number"
                      className="input"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-zinc-400">الوصف</label>
                  <textarea 
                    required
                    className="input min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 flex justify-between items-center">
                    روابط الصور
                    <button type="button" onClick={addImageField} className="text-amber-500 text-xs hover:underline">+ إضافة صورة</button>
                  </label>
                  {formData.images?.map((img, i) => (
                    <input 
                      key={i}
                      className="input py-2 text-sm"
                      placeholder={`رابط الصورة ${i + 1}`}
                      value={img}
                      onChange={(e) => {
                        const newImages = [...(formData.images || [])];
                        newImages[i] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 flex justify-between items-center">
                    الإضافات
                    <button type="button" onClick={addExtraField} className="text-amber-500 text-xs hover:underline">+ إضافة ميزة</button>
                  </label>
                  {formData.extras?.map((extra, i) => (
                    <input 
                      key={i}
                      className="input py-2 text-sm"
                      placeholder={`ميزة ${i + 1}`}
                      value={extra}
                      onChange={(e) => {
                        const newExtras = [...(formData.extras || [])];
                        newExtras[i] = e.target.value;
                        setFormData({ ...formData, extras: newExtras });
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 accent-amber-500"
                  />
                  <label htmlFor="featured">سيارة مميزة (تظهر في الرئيسية)</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Check />}
                  حفظ السيارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;
