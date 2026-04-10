'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import PageEditor from '@/components/PageEditor';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/admin/pages/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setPageData(data);
        } else {
          alert('Sahifa topilmadi');
          router.push('/admin');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [params.id]);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/pages/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert(data.error || 'Xatolik yuz berdi');
      }
    } catch (error) {
      alert('Server bilan bog\'lanishda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sahifani tahrirlash</h1>
        <p className="text-slate-500 mt-1">Mavjud sahifa kontenti va SEO sozlamalarini o'zgartiring</p>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center rounded-[2.5rem] shadow-sm text-slate-400 font-bold">Yuklanmoqda...</div>
      ) : (
        <PageEditor initialData={pageData} onSave={handleSave} isSubmitting={isSubmitting} />
      )}
    </AdminLayout>
  );
}
