import { RefreshCcw, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  onClear: () => void;
}

export default function ChatHeader({ onClear }: ChatHeaderProps) {
  return (
    <header className="header">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="header-inner"
      >
        <div className="header-brand">
          <div className="brand-icon">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Spur</span>
            <span className="brand-suffix">Support</span>
            <span className="brand-badge">AI</span>
          </div>
        </div>

        <div className="header-right">
          <div className="status-pill">
            <span className="status-dot" />
            <span>Online</span>
          </div>
          <button className="clear-btn" onClick={onClear} title="New conversation">
            <RefreshCcw size={13} />
            <span>New Chat</span>
          </button>
        </div>
      </motion.div>
    </header>
  );
}