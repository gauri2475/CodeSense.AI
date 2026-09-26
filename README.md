# 🧠 CodeSense AI • Smart Code Explainer

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenRouter API](https://img.shields.io/badge/OpenRouter-API-6366F1?logo=openai&logoColor=white)](https://openrouter.ai/)
[![Code Quality](https://img.shields.io/badge/Linter-0_Errors_0_Warnings-emerald)](https://github.com/oxc-project/oxc)

An interactive, responsive web application that allows software engineers, students, and code reviewers to paste code in any programming language and receive structured, instant AI-powered explanations. Built with **React 19**, **JavaScript (ES6+)**, **Tailwind CSS v4**, and connected to the **OpenRouter Chat Completions API**.

---

## 🚀 Live Demo & Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-code-explainer.git
cd ai-code-explainer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
Copy `.env.example` to `.env` if you wish to pre-load an OpenRouter key for local development:
```bash
cp .env.example .env
```
> **Security Notice**: `.env` is fully excluded in `.gitignore` to guarantee your keys are never leaked to Git. Alternatively, keys can be entered directly into the browser UI without creating a `.env` file (stored only in client-side `localStorage`).

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌟 Key Features

- **⚡ Real-Time AI Explanations via OpenRouter**:
  Connects to OpenRouter's `/api/v1/chat/completions` endpoint with support for free LLM models (`Meta Llama 3.2 3B`, `Google Gemini 2.0 Flash`, `Qwen 2.5 Coder`, etc.).

- **🛡️ Client-Side Validation & Loading State**:
  JavaScript validates input length and whitespace before dispatching requests, immediately triggering the prominent **"Analyzing code..."** state with animated progress stages.

- **🎚️ 5 Explanation Depth & Style Modes**:
  1. **Beginner Friendly (👶 ELI5)**: Plain analogies, intuitive breakdowns, jargon-free explanations.
  2. **Standard Breakdown (💡 Thorough)**: Step-by-step logic walkthrough, architectural overview, and core concepts.
  3. **Interview / Deep Dive (⚡ Big-O & Bugs)**: Rigorous Time and Space complexity ($O(N)$ analysis), boundary edge cases, and optimization.
  4. **Clean Code & Best Practices (✨ Code Review)**: Refactoring suggestions, design patterns, and code smells.
  5. **Bug Hunter & Security Audit (🛡️ Defensive)**: Input sanitization, concurrency safety, and edge-case defenses.

- **📝 Interactive Code Editor**:
  Dynamic line-number gutter synchronized with scrolling, character/line counters, and quick keyboard execution (`Ctrl + Enter` / `Cmd + Enter`).

- **💡 Preloaded Sample Snippets**:
  Instant presets for JavaScript (Debounce closure), Python (Binary Search), React (Custom `useFetch` hook with `AbortController`), and SQL (Window functions).

- **🔊 Text-to-Speech (Web Speech API)**:
  Built-in voice reader allowing users to listen to the explanation read aloud in natural speech.

- **💾 LocalStorage History Tracker**:
  Persists previously analyzed code snippets and AI explanations locally so you can revisit past queries anytime.

- **📋 Export Options**:
  One-click copy to clipboard and **Download as `.md`** file.

- **✨ Interactive MagicBento Cards**:
  The Code Input and AI Explanation cards feature **GSAP**-powered physics: 3D perspective tilt, floating particle stars, click ripples, and dynamic cursor spotlights with reactive border glow.

- **🔤 Animated LetterGlitch Matrix Canvas Background**:
  Canvas-driven code scrambling animation running smoothly in the background with subtle cyber teal and copper transitions.

- **🎭 Built-in Demo Mode**:
  Recruiters or interviewers can evaluate the application instantly without needing their own OpenRouter API key.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 19 (Hooks, Functional Components) | Declarative UI, state-driven rendering, strict mode compliance |
| **Bundler** | Vite 8 | Instant HMR, Rolldown engine optimizations, lightning-fast builds |
| **Styling** | Tailwind CSS v4 | High-performance CSS engine, modern dark palette, responsive flex/grid |
| **Icons** | Lucide React | Tree-shakable SVG developer icons |
| **Markdown** | React-Markdown + Remark-GFM | Safe AST-based markdown parsing for tables, lists, and code blocks |
| **Animation Physics** | GSAP (GreenSock) | 3D card tilt, particle stars, magnetism, and spotlights |
| **AI Integration** | OpenRouter Chat Completions API | Universal LLM gateway supporting free and frontier models |

---

## 🏗️ Project Structure

```
ai-code-explainer/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx             # OpenRouter API key & model settings modal
│   │   ├── CodeInputSection.jsx        # Line-numbered editor & sample loader
│   │   ├── ExplanationOutputSection.jsx# Dynamic output, Markdown render, speech reader
│   │   ├── Footer.jsx                  # Tech stack pills and attribution
│   │   ├── HistoryModal.jsx            # LocalStorage query history
│   │   └── Navbar.jsx                  # Header with status pills and actions
│   ├── data/
│   │   └── sampleCodes.js              # Presets for JS, Python, React, SQL
│   ├── services/
│   │   └── openRouterService.js        # API service, prompt engineering, demo fallback
│   ├── App.jsx                         # Main application container & state coordinator
│   ├── App.css                         # Custom animation utilities
│   ├── index.css                       # Tailwind v4 import & theme styles
│   └── main.jsx                        # React root entry point
├── .env.example            # Environment template for VITE_OPENROUTER_API_KEY
├── index.html              # HTML5 template with developer fonts
├── package.json
└── vite.config.js          # Vite config with React & Tailwind plugins
```

---

## 🎯 How to Use OpenRouter API

1. Visit [openrouter.ai/keys](https://openrouter.ai/keys) to create a free account and generate an API key.
2. In the app, click **"Configure API Key"** in the top navigation.
3. Paste your key (`sk-or-v1-...`) and pick any free model (e.g. `Meta Llama 3.2 3B Free`).
4. Click **Save Configuration**. *(Your key remains in your local browser storage and is never uploaded anywhere else).*

> **Tip for Recruiters**: If you don't have an API key, simply toggle **Demo Mode** in the settings modal or click **Enable Demo Mode** on the homepage banner to test immediately!

---

## 💼 Front-End Interview Talking Points

- **Component Decoupling**: State flows downwards through props while custom events trigger handlers in `App.jsx`, ensuring modularity and testability.
- **Defensive Error Handling**: Handled HTTP 401 (unauthorized), 429 (rate-limited), network disconnects, and empty responses with actionable UI error states.
- **Performance Optimization**: Clean cleanup routines on `useEffect` timers and unmounted `speechSynthesis` instances to prevent memory leaks.
- **Accessibility & UX**: Clear contrast ratios, keyboard-friendly navigation (`Ctrl+Enter`), responsive layout across mobile and 4K displays.

---

## 📜 License
MIT License. Feel free to use this project as inspiration or part of your developer portfolio!
