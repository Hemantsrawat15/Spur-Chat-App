import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="msg-row msg-row--ai"
    >
      <div className="avatar avatar--ai">
        <Zap size={13} strokeWidth={2.5} />
      </div>
      <div className="typing-bubble">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="typing-dot"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}