'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let sid = localStorage.getItem('prim_chat_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('prim_chat_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (!isOpen || !sessionId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        if (res.ok) setMessages(await res.json());
      } catch {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !sessionId) return;
    const tempText = inputText;
    setInputText('');
    setMessages(prev => [...prev, { session_id: sessionId, sender: 'user', message: tempText, created_at: new Date().toISOString() }]);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: tempText, sender: 'user' }),
      });
    } catch {}
  };

  return (
    <>
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-panel {
          animation: chatSlideUp 0.25s cubic-bezier(0.23,1,0.32,1) both;
        }
      `}</style>

      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, fontFamily: 'system-ui, sans-serif' }}>
        {/* Chat Panel — CSS animation, no framer-motion */}
        {isOpen && (
          <div
            className="chat-panel"
            style={{
              position: 'absolute',
              bottom: '5rem',
              right: 0,
              width: '350px',
              height: '450px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                <div>
                  <h4 style={{ margin: 0, color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>Поддержка Prim-Uslugi</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Онлайн • Ответим быстро</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <MessageSquare size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'white' }}>Чат поддержки клиентов</p>
                  <p style={{ margin: 0 }}>Напишите нам, если у вас возникли вопросы по услугам, ценам или заказу!</p>
                </div>
              )}
              {messages.map((msg, index) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-start' : 'flex-end', width: '100%' }}>
                    <div style={{
                      maxWidth: '80%', padding: '0.75rem 1rem',
                      borderRadius: isAdmin ? '1rem 1rem 1rem 0.25rem' : '1rem 1rem 0.25rem 1rem',
                      backgroundColor: isAdmin ? 'rgba(255,255,255,0.08)' : '#3b82f6',
                      color: 'white', fontSize: '0.875rem', lineHeight: '1.4', wordBreak: 'break-word',
                    }}>
                      {msg.message}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {isAdmin ? 'Оператор' : 'Вы'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem', backgroundColor: '#1e293b' }}>
              <input
                type="text"
                placeholder="Введите сообщение..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ flex: 1, padding: '0.625rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0f172a', color: 'white', fontSize: '0.875rem', outline: 'none' }}
              />
              <button type="submit" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#3b82f6', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ width: '3.75rem', height: '3.75rem', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3)', transition: 'transform 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </>
  );
}
