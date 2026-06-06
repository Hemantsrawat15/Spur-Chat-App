# Spur AI Chat Agent 🚀

A mini AI support agent for a live chat widget, built as part of the Founding Full-Stack Engineer take-home assignment.

## ✨ Features
- **Modern UI/UX**: Premium Glassmorphism design with fluid animations via Framer Motion.
- **Persistent Conversations**: Chat history is saved to a SQLite database and persists across browser refreshes.
- **AI-Powered**: Integrated with Groq (Llama 3 70B) for fast and intelligent support responses.
- **Domain Knowledge**: Seeded with store-specific knowledge (shipping, returns, hours).
- **Robustness**: Input validation with Zod, character limits, and graceful error handling.

## 🛠️ Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion.
- **Backend**: Node.js + TypeScript + Express.
- **Database**: SQLite + Prisma.
- **LLM**: Groq (Llama 3).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A [Groq API Key](https://console.groq.com/) (Free and fast)

### 2. Setup Backend
```bash
cd backend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

**Initialize Database:**
```bash
npx prisma generate
npx prisma db push
```

**Run Backend:**
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5174` (or similar, check console).

---

## 🏗️ Architecture Overview

### Backend Layers
1. **API (Express)**: Handles routing and request validation. Use `cors` for cross-origin access from the Vite frontend.
2. **Validation (Zod)**: Ensures all incoming messages meet length and type requirements before hitting the logic layer.
3. **Services (Prisma/LLM)**: 
   - `index.ts`: Manages the flow between database persistence and the AI service.
   - `llm.service.ts`: Encapsulates the interaction with the Groq API, including system prompts and history management.
4. **Data Persistence**: Uses Prisma with the SQLite adapter for Zero-Config setup.

### Frontend Structure
- **App.tsx**: The core chat interface. Manages session state via `localStorage` and handles real-time UI updates.
- **Animations**: Framer Motion handles the entry of each message bubble for a "live" feel.
- **Styling**: Tailwind CSS v4 provides a utility-first, performant design system.

---

## 🧠 Design Decisions & Trade-offs

- **Tailwind v4**: Chosen for its CSS-first approach and performance.
- **SQLite**: Used for ease of evaluation (no need to set up a full Postgres instance).
- **Llama 3 70B**: Chosen via Groq for its high quality-of-reasoning compared to smaller models, while remaining extremely fast.
- **Session Management**: Used simple `localStorage` IDs. In a production app, this would be replaced by JWT-based authentication.

## 🔮 If I Had More Time...
1. **Streaming Responses**: I would implement WebSockets or Server-Sent Events (SSE) to stream the AI response character-by-character for a more interactive experience.
2. **Context Window Management**: Implement better token counting to prevent hitting LLM context limits on very long conversations (currently caps at 10 messages).
3. **Multi-tenant Knowledge**: Allow different knowledge bases to be loaded depending on the session or URL.
4. **Unit Tests**: Add Jest/Vitest for the LLM service and React Testing Library for the UI components.
