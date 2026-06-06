import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function ChatInput({ value, onChange, onSubmit, loading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const pct = Math.round((value.length / 1000) * 100);

  return (
    <div className="input-area">
      <form onSubmit={onSubmit} className="input-form">
        <div className={`input-shell ${loading ? 'input-shell--busy' : ''}`}>
          <textarea
            ref={textareaRef}
            className="input-field"
            placeholder="Ask anything… (⏎ to send)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={1000}
            rows={1}
          />

          <div className="input-actions">
            <div className="char-ring" title={`${value.length}/1000`}>
              <svg width="22" height="22" viewBox="0 0 22 22">
                <circle cx="11" cy="11" r="9" fill="none" stroke="var(--ring-bg)" strokeWidth="2" />
                <circle
                  cx="11" cy="11" r="9"
                  fill="none"
                  stroke={pct > 90 ? '#ef4444' : 'var(--accent)'}
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 9}`}
                  strokeDashoffset={`${2 * Math.PI * 9 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 11 11)"
                  style={{ transition: 'stroke-dashoffset 0.2s ease' }}
                />
              </svg>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !value.trim()}
              whileTap={{ scale: 0.9 }}
              className="send-btn"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
        <p className="input-hint">Shift + Enter for newline · AES-256 encrypted</p>
      </form>
    </div>
  );
}