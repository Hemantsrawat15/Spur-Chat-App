import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2, RefreshCcw, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
}

const API_BASE = "http://localhost:5000";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Get or Create Session ID (Persists on refresh)
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem("spur_session_id");
    if (saved) return saved;
    const newId = "session-" + Math.random().toString(36).substring(7);
    localStorage.setItem("spur_session_id", newId);
    return newId;
  });

  // 2. Fetch history when app loads
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chat/${sessionId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Could not load history", err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  // 3. Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 4. Send Message Logic
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (input.length > 1000) {
      alert("Message is too long. Please keep it under 1000 characters.");
      return;
    }

    const userMsg: Message = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat/message`, {
        message: currentInput,
        sessionId
      });
      
      const aiMsg: Message = { role: 'assistant', text: response.data.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { role: 'assistant', text: "⚠️ Connection Error: Please ensure the backend server is running." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Start a new conversation? History will be cleared.")) {
      localStorage.removeItem("spur_session_id");
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col w-full max-w-2xl h-[85vh] bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20"
      >
        {/* HEADER */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-20 h-20 bg-white blur-3xl -translate-x-10 -translate-y-10"></div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
              <Bot size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none flex items-center gap-2">
                Spur Support <Sparkles size={16} className="text-yellow-300 fill-yellow-300" />
              </h1>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Powered by Spur AI
              </p>
            </div>
          </div>
          
          <button 
            onClick={clearChat}
            className="flex items-center gap-2 text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 py-2.5 px-4 rounded-xl transition-all border border-white/10 backdrop-blur-sm"
          >
            <RefreshCcw size={14} /> New Chat
          </button>
        </header>

        {/* CHAT WINDOW */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-gray-50/50 to-white/50">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key="welcome"
                className="text-center py-20 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <MessageSquare className="text-indigo-600/30" size={40} />
                </div>
                <h2 className="text-gray-800 font-bold text-2xl mb-2">How can we help?</h2>
                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                  Ask us anything about shipping, returns, or our products. Our AI is here for you 24/7.
                </p>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' 
                      : 'bg-white border border-gray-100'
                  }`}>
                    {msg.role === 'user' 
                      ? <User size={20} className="text-white" /> 
                      : <Bot size={20} className="text-indigo-600" />
                    }
                  </div>
                  <div className={`relative px-5 py-3 shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-3xl rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-3xl rounded-tl-none border border-gray-100 shadow-xl shadow-gray-200/20'
                  }`}>
                    {msg.role === 'assistant' ? (
                       <div className="markdown-content">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                       </div>
                    ) : (
                      msg.text
                    )}
                    {msg.role === 'assistant' && (
                      <div className="absolute bottom-0 left-0 -mb-5 text-[10px] text-gray-400 font-medium tracking-wide flex items-center gap-1">
                        AI AGENT • SPUR
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start items-center gap-3 text-indigo-500/80 text-xs font-bold tracking-widest uppercase pl-2"
              >
                <div className="flex gap-1.5 bg-indigo-50 p-2.5 rounded-full px-4 border border-indigo-100 shadow-sm">
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }} 
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }} 
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-indigo-600 rounded-full" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} className="pt-2" />
        </div>

        {/* INPUT AREA */}
        <form 
          onSubmit={handleSendMessage} 
          className="p-6 bg-white/50 backdrop-blur-xl border-t border-gray-100 relative group"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          
          <div className="flex gap-3 items-center bg-gray-50/80 rounded-2xl p-2 border border-gray-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
            <input
              type="text"
              className="flex-1 bg-transparent p-3 text-sm focus:outline-none text-gray-700 font-medium placeholder:text-gray-400"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={1000}
            />
            <motion.button
              whileActive={{ scale: 0.95 }}
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl disabled:opacity-20 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Send size={20} />
            </motion.button>
          </div>
          <div className="flex justify-between items-center px-1 mt-3">
             <p className="text-[10px] text-gray-400 font-semibold tracking-tighter uppercase">
              Secure AES-256 Link
            </p>
            <p className="text-[10px] text-gray-400 font-semibold tracking-tighter uppercase">
              {input.length}/1000
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default App;
App;