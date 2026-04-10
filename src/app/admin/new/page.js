'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import PageEditor from '@/components/PageEditor';

export default function NewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert(data.error || 'Произошла ошибка');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Создание новой страницы</h1>
        <p className="text-slate-500 mt-1">Добавьте новый раздел и контент для вашего сайта</p>
      </div>

      <PageEditor onSave={handleSave} isSubmitting={isSubmitting} />
    </AdminLayout>
  );
}
