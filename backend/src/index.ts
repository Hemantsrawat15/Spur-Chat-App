import crypto from "crypto";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { generateAIResponse } from "./llm.service.js";
import { z } from "zod";

dotenv.config();
const app = express();

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const MessageSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().optional(),
});

// 1. Get Chat History
app.get("/chat/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: sessionId },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 2. Send a Message
app.post("/chat/message", async (req, res) => {
  const validation = MessageSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ 
      error: "Invalid input", 
      details: validation.error.format() 
    });
  }

  let { message, sessionId } = validation.data;
  
  // If no sessionId provided, generate one (UUID)
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }

  try {
    // Ensure conversation exists
    let conversation = await prisma.conversation.findUnique({ where: { id: sessionId } });
    if (!conversation) {
      conversation = await prisma.conversation.create({ data: { id: sessionId } });
    }

    // Save User Message
    await prisma.message.create({
      data: { conversationId: sessionId, role: "user", text: message },
    });

    // Get History for Context (last 10 messages)
    const history = await prisma.message.findMany({
      where: { conversationId: sessionId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    // Reverse to get chronological order for LLM
    const chronologicalHistory = history.reverse();

    // Truncate message for LLM if it's very long (though validation handles up to 2000)
    const truncatedMessage = message.slice(0, 1000);

    // Get AI Response
    const aiReply = await generateAIResponse(truncatedMessage, chronologicalHistory);

    // Save AI Message
    await prisma.message.create({
      data: { conversationId: sessionId, role: "assistant", text: aiReply },
    });

    res.json({ reply: aiReply, sessionId });
  } catch (error) {
    console.error("Chat Logic Error:", error);
    res.status(500).json({ error: "Something went wrong on our end. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Spur Backend running on port ${PORT}`);
  console.log(`📡 Database: SQLite (prisma/dev.db)`);
});