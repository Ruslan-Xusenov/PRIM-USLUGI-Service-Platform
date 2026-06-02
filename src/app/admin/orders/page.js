'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Trash2, CheckCircle, Clock, XCircle, Search, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.service?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status) => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.625rem',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: 700,
    };
    switch (status) {
      case 'pending':
        return { ...base, backgroundColor: '#fef3c7', color: '#d97706' };
      case 'accepted':
        return { ...base, backgroundColor: '#dbeafe', color: '#2563eb' };
      case 'completed':
        return { ...base, backgroundColor: '#dcfce7', color: '#15803d' };
      case 'rejected':
        return { ...base, backgroundColor: '#fee2e2', color: '#b91c1c' };
      default:
        return base;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'В обработке';
      case 'accepted': return 'Принят';
      case 'completed': return 'Выполнен';
      case 'rejected': return 'Отклонен';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Управление заказами</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Просматривайте и управляйте статусами заказов клиентов</p>
          </div>
          <button 
            onClick={fetchOrders}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
          >
            <RefreshCw size={14} /> Обновить
          </button>
        </div>

        {/* Filters and Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '250px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.75rem', padding: '0.5rem 1rem' }}>
            <Search size={16} style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Поиск по имени, телефону или услуге..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#1e293b', width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'pending', 'accepted', 'completed', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  border: statusFilter === status ? 'none' : '1px solid #e2e8f0',
                  background: statusFilter === status ? '#0f172a' : 'white',
                  color: statusFilter === status ? 'white' : '#475569',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {status === 'all' ? 'Все' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Загрузка заказов...</div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Заказы не найдены</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '1rem 1.5rem' }}>ID</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Клиент</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Услуга</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Время приезда</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Статус</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Дата</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#64748b' }}>#{order.id}</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{order.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{order.phone}</div>
                        {order.email && <div style={{ color: '#3b82f6', fontSize: '0.8rem' }}>{order.email}</div>}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{order.service || 'Общая заявка'}</div>
                        {order.comment && <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.comment}>{order.comment}</div>}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#475569', fontWeight: 500 }}>{order.arrival_time || 'Как можно скорее'}</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={getStatusBadgeStyle(order.status)}>
                          {order.status === 'pending' && <Clock size={12} />}
                          {order.status === 'accepted' && <CheckCircle size={12} />}
                          {order.status === 'completed' && <CheckCircle size={12} />}
                          {order.status === 'rejected' && <XCircle size={12} />}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#64748b' }}>
                        {new Date(order.created_at).toLocaleDateString('ru-RU')} <br />
                        <span style={{ fontSize: '0.75rem' }}>{new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem',
                              outline: 'none',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            <option value="pending">В обработке</option>
                            <option value="accepted">Принят</option>
                            <option value="completed">Выполнен</option>
                            <option value="rejected">Отклонен</option>
                          </select>
                          <button
                            onClick={() => handleDelete(order.id)}
                            style={{
                              padding: '0.375rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #fee2e2',
                              background: '#fff5f5',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#ef4444'; }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
