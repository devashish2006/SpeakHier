# 🎙️ SpeakHier — AI-Powered Interview Intelligence Platform

SpeakHier is a next-gen SaaS platform that enables AI-based voice interviews with real-time contextual understanding, intelligent feedback, and memory. Designed for mock interviews, HR screening, and personalized practice sessions, SpeakHier leverages cutting-edge technologies to simulate human-like conversation, evaluate performance, and improve candidate preparation.

---

## 🧠 Key Features

- 🎤 **Voice-to-Voice Interviews** — Real-time interactive sessions with an AI interviewer.
- 🧭 **Dynamic Context Memory** — Uses **Mem0** + **QuadrantDB** to retain real-time conversation flow and session memory.
- 🔗 **Agent Architecture** — Modular agents handle parsing, context tracking, scoring, and recommendation.
- 🕸️ **Relation Mapping** — **Neo4j** graph DB handles semantic relationships and user profile embeddings.
- 📊 **Feedback & Scoring** — Instant insights on communication, confidence, and technical correctness.
- 🌐 **Multiplatform Access** — Responsive UI built with **Next.js** for web and mobile users.

---

## 🔄 PAG Pipeline Overview

The **PAG (Parse–Assess–Generate)** pipeline powers the core interview logic:

1. **Parse**: Converts audio to text using Whisper/STT and extracts intent.
2. **Assess**: Evaluates context using agents + Neo4j + Mem0 memory.
3. **Generate**: Forms relevant follow-ups and feedback using GPT-4.

---

## 🛠️ Tech Stack

| Layer | Tech |
|------|------|
| Frontend | **Next.js**, Tailwind CSS |
| Backend | **Python** (FastAPI), Node.js |
| AI Engine | **ChatGPT-4.0**, Whisper, Coqui TTS |
| Memory | **Mem0**, **QuadrantDB** |
| Vector Embeddings & Graphs | **Neo4j**, LangChain |
| Auth | JWT / OAuth |
| Deployment | Vercel / Docker / Railway / GCP |

---

## 🚀 Getting Started

```bash
git clone 
cd speakhier
npm install && cd backend && pip install -r requirements.txt
npm run dev # for frontend
uvicorn main:app --reload # for backend
