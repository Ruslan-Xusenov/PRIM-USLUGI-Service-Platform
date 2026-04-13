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
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Создание новой страницы</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1rem' }}>Добавьте новый раздел и контент для вашего сайта</p>
      </div>

      <PageEditor onSave={handleSave} isSubmitting={isSubmitting} />
    </AdminLayout>
  );
}
