'use client';
import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { MessageSquare, Send, RefreshCw, Clock } from 'lucide-react';

export default function AdminChatPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch all chat sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/chat');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Failed to load chat sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected session
  const fetchMessages = async (sid) => {
    if (!sid) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${sid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 6000);
    return () => clearInterval(interval);
  }, []);

  // Poll current messages when session selected
  useEffect(() => {
    if (!selectedSessionId) return;
    fetchMessages(selectedSessionId);
    const interval = setInterval(() => fetchMessages(selectedSessionId), 3000);
    return () => clearInterval(interval);
  }, [selectedSessionId]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedSessionId) return;

    const tempText = inputText;
    setInputText('');

    // Optimistic update
    setMessages(prev => [...prev, { session_id: selectedSessionId, sender: 'admin', message: tempText, created_at: new Date().toISOString() }]);

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedSessionId, message: tempText }),
      });
      if (res.ok) {
        fetchSessions(); // Refresh sidebar order
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
        
        {/* Title Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Чат поддержки</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Отвечайте на вопросы клиентов в режиме реального времени</p>
          </div>
          <button 
            onClick={fetchSessions}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
          >
            <RefreshCw size={14} /> Обновить
          </button>
        </div>

        {/* Chat Area */}
        <div style={{ display: 'flex', flex: 1, background: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden', minHeight: 0 }}>
          
          {/* Left Panel: Session list */}
          <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
              Активные диалоги
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Загрузка...</div>
            ) : sessions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                Диалогов пока нет
              </div>
            ) : (
              sessions.map(s => {
                const isActive = s.session_id === selectedSessionId;
                return (
                  <button
                    key={s.session_id}
                    onClick={() => setSelectedSessionId(s.session_id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      padding: '1.25rem 1.5rem',
                      border: 'none',
                      borderBottom: '1px solid #f1f5f9',
                      background: isActive ? '#f8fafc' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>Клиент #{s.session_id.replace('session_', '')}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(s.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '260px' }}>
                      {s.last_message}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Panel: Conversation */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            {selectedSessionId ? (
              <>
                {/* Header */}
                <div style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Диалог с Клиентом #{selectedSessionId.replace('session_', '')}</span>
                </div>

                {/* Messages list */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((msg, index) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isAdmin ? 'flex-end' : 'flex-start',
                          width: '100%',
                        }}
                      >
                        <div style={{
                          maxWidth: '70%',
                          padding: '0.75rem 1rem',
                          borderRadius: isAdmin ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                          backgroundColor: isAdmin ? '#0f172a' : 'white',
                          color: isAdmin ? 'white' : '#0f172a',
                          border: isAdmin ? 'none' : '1px solid #e2e8f0',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                          fontSize: '0.875rem',
                          lineHeight: '1.4',
                        }}>
                          {msg.message}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          {isAdmin ? 'Вы (Оператор)' : 'Клиент'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <form onSubmit={handleSend} style={{ padding: '1.25rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Введите ответ..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.25rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#0f172a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <Send size={16} /> Отправить
                  </button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <MessageSquare size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <span>Выберите активный диалог в левой панели</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
