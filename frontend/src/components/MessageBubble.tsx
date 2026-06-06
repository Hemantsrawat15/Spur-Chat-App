import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Zap } from 'lucide-react';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={`msg-row ${isUser ? 'msg-row--user' : 'msg-row--ai'}`}
    >
      {!isUser && (
        <div className="avatar avatar--ai">
          <Zap size={13} strokeWidth={2.5} />
        </div>
      )}

      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--ai'}`}>
        {isUser ? (
          <p className="bubble-text">{message.text}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="avatar avatar--user">
          <span>U</span>
        </div>
      )}
    </motion.div>
  );
}