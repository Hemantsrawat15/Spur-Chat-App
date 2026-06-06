import { motion } from 'framer-motion';

const SUGGESTIONS = [
  'Track my order',
  'Return policy',
  'Product availability',
  'Shipping rates',
];

interface EmptyStateProps {
  onSuggest: (text: string) => void;
}

export default function EmptyState({ onSuggest }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="empty-state"
    >
      <div className="empty-glyph">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M24 4V44M4 14L44 14M4 34L44 34" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          <circle cx="24" cy="24" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <h2 className="empty-title">How can we help?</h2>
      <p className="empty-sub">
        Ask anything about orders, returns, shipping, or our products.
      </p>
      <div className="suggestions">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="suggestion-chip"
            onClick={() => onSuggest(s)}
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}