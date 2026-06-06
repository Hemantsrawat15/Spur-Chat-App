import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  onSuggest: (text: string) => void;
}

export default function ChatWindow({ messages, loading, onSuggest }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      <AnimatePresence mode="wait">
        {messages.length === 0 && !loading ? (
          <EmptyState key="empty" onSuggest={onSuggest} />
        ) : (
          <div className="messages-list" key="messages">
            {messages.map((msg, idx) => (
              <MessageBubble key={msg.id ?? idx} message={msg} index={idx} />
            ))}
            <AnimatePresence>
              {loading && <TypingIndicator key="typing" />}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}