import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './index.css';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('spur_session_id');
    if (saved) return saved;
    const newId = 'session-' + Math.random().toString(36).substring(7);
    localStorage.setItem('spur_session_id', newId);
    return newId;
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chat/${sessionId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Could not load history', err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    if (input.length > 1000) {
      alert('Message is too long. Please keep it under 1000 characters.');
      return;
    }

    const userMsg: Message = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat/message`, {
        message: currentInput,
        sessionId,
      });
      
      const { reply, sessionId: serverSessionId } = response.data;
      
      // Update local sessionId if server returned a new one (first message case)
      if (serverSessionId && serverSessionId !== sessionId) {
        localStorage.setItem('spur_session_id', serverSessionId);
      }

      const aiMsg: Message = { role: 'assistant', text: reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        role: 'assistant',
        text: '⚠️ Connection error — please ensure the backend server is running.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Start a new conversation? History will be cleared.')) {
      localStorage.removeItem('spur_session_id');
      window.location.reload();
    }
  };

  const handleSuggest = (text: string) => {
    setInput(text);
  };

  return (
    <div className="app-shell">
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="chat-card">
        <ChatHeader onClear={clearChat} />
        <ChatWindow messages={messages} loading={loading} onSuggest={handleSuggest} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}