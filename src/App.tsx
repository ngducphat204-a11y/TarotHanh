import { useState, useRef, useEffect } from 'react';
import { sendMessage, type AiResponse } from './api';
import type { TarotCard } from './TarotData';

/* ─── Types ─── */
interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  card?: TarotCard;
}

/* ─── Quick‑action chips ─── */
const QUICK_ACTIONS = [
  '🃏 Bốc 1 lá',
  '💜 Tình yêu',
  '💼 Công việc',
  '✨ Năng lượng hôm nay',
];

/* ─── Main App ─── */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hey Hạnh 💫\nMuốn bốc bài hay tâm sự gì thì cứ nhắn anh nhé 🌙',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'HongHanh' && password === '1032005') {
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      setLoginError('Tên đăng nhập hoặc mật khẩu chưa đúng rồi Hạnh ơi 😢');
    }
  };

  /* ─── Send message ─── */
  const send = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;

    const userMsg: Message = { id: Date.now(), text: value, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response: AiResponse = await sendMessage(value);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response.text,
          sender: 'ai',
          card: response.card,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Anh xin lỗi Hạnh, hình như kết nối của anh đang bị trục trặc rồi. Đợi anh chút nhé! 😢',
          sender: 'ai',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h1>Tarot 🌙</h1>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && <p className="error-msg">{loginError}</p>}
            <button type="submit" className="login-btn">Vào xem bài 🔮</button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── Render Chat ─── */
  return (
    <div className="app-shell">
      {/* Header */}
      <header className="header">
        <div className="header-avatar">🌙</div>
        <div className="header-info">
          <h1>Hạnh's Tarot</h1>
          <p>Personal soul guide</p>
        </div>
        <div className="status-badge">
          <span className="dot" />
          Online
        </div>
      </header>

      {/* Chat */}
      <div className="chat-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-row ${msg.sender}`}>
            <div className="msg-bubble">
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>

              {msg.card && (
                <div className="card-reveal">
                  <div className="card-info">
                    <h3>{msg.card.name}</h3>
                    <p className="card-meaning">{msg.card.meaning}</p>
                    <p className="card-desc">{msg.card.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="msg-row ai">
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {QUICK_ACTIONS.map((label) => (
          <button key={label} className="quick-btn" onClick={() => send(label)}>
            {label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="input-bar">
        <div className="input-wrap">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Hỏi Tarot điều bạn muốn biết..."
          />
          <button
            className="send-btn"
            onClick={() => send()}
            disabled={!input.trim() || isLoading}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
