import { SAMPLE_CODES } from '../data/sampleCodes.js';

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const POPULAR_MODELS = [
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B (Free)', provider: 'Meta' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', provider: 'Google' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B (Free)', provider: 'Qwen' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)', provider: 'Meta' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)', provider: 'DeepSeek' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' }
];

const LOCAL_STORAGE_KEY = 'code_explainer_openrouter_key';
const LOCAL_STORAGE_MODEL = 'code_explainer_model';
const LOCAL_STORAGE_DEMO = 'code_explainer_demo_mode';

export function getStoredApiKey() {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || import.meta.env.VITE_OPENROUTER_API_KEY || '';
}

export function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

export function getStoredModel() {
  return localStorage.getItem(LOCAL_STORAGE_MODEL) || 'meta-llama/llama-3.2-3b-instruct:free';
}

export function setStoredModel(model) {
  localStorage.setItem(LOCAL_STORAGE_MODEL, model);
}

export function getIsDemoMode() {
  const val = localStorage.getItem(LOCAL_STORAGE_DEMO);
  return val ? JSON.parse(val) : false;
}

export function setIsDemoMode(isDemo) {
  localStorage.setItem(LOCAL_STORAGE_DEMO, JSON.stringify(isDemo));
}

/**
 * Builds the system instruction according to the requested explanation level
 */
function buildSystemPrompt(level) {
  if (level === 'beginner') {
    return `You are a patient and friendly coding mentor. 
Your goal is to explain code in the simplest, most intuitive terms possible (like an ELI5).
Rules:
- Start with a simple 1-2 sentence real-world analogy.
- Break down the steps in plain English without confusing technical jargon.
- Explain what each key variable and function does.
- Format with clean Markdown headers, bullet points, and brief code highlights.`;
  }

  const isInterview = level === 'interview';
  const isCodeReview = level === 'code-review';
  const isSecurity = level === 'security';

  let specializedInstructions = `- Practical Production Use Cases: When and where this is used in real applications.
- Performance & Reliability Considerations: Best practices for production use.`;

  if (isInterview) {
    specializedInstructions = `- Big-O Complexity Analysis: Exact Time Complexity and Space Complexity with mathematical reasoning and tables.
- Potential Edge Cases & Bugs: Null inputs, boundaries, concurrency, and overflow.
- Concrete Optimization Recommendations: How to refactor or optimize further.`;
  } else if (isCodeReview) {
    specializedInstructions = `- Code Quality & Clean Code Review: Evaluate naming conventions, readability, modularity, and adherence to SOLID principles.
- Anti-Patterns & Code Smells: Identify any anti-patterns and explain how to eliminate them.
- Refactored Idiomatic Code: Provide an improved, production-grade refactored version of the snippet.`;
  } else if (isSecurity) {
    specializedInstructions = `- Security & Defensive Vulnerability Audit: Audit for injection, XSS, memory leaks, boundary errors, unhandled rejections, and race conditions.
- Defensive Coding & Edge Cases: Explicitly test extreme inputs (null, undefined, massive payload, NaN, negative bounds).
- Hardening Recommendations: Concrete steps to make this code resilient and secure in hostile environments.`;
  }

  return `You are an expert Principal Software Engineer and technical educator.
You MUST provide your response in TWO DISTINCT SECTIONS separated by the exact delimiter line:
===DETAILED_ANALYSIS===

[SECTION 1: Above ===DETAILED_ANALYSIS===]
Provide a clear, beginner-friendly summary of the code and its high-level purpose suitable for a quick overview:
- 1-2 sentence intuitive real-world analogy.
- What the code is doing in plain English without heavy jargon.
- Clear explanation of the main variables and return value.

[SECTION 2: Below ===DETAILED_ANALYSIS===]
Provide the full comprehensive in-depth technical explanation:
- Code Purpose & Architecture: State clearly the problem this code solves and why it is designed this way.
- Step-by-Step Logic Breakdown: Walk through each line or block with technical depth.
- Language Idioms & Design Patterns: Highlight notable conventions or patterns used.
${specializedInstructions}

Format cleanly with Markdown headers, bullet points, and code blocks.`;
}

/**
 * Sends code to OpenRouter API (or mock generator if demo mode is enabled)
 */
export async function explainCode({
  code,
  language = 'javascript',
  level = 'detailed',
  apiKey = '',
  model = 'meta-llama/llama-3.2-3b-instruct:free',
  isDemo = false
}) {
  const startTime = performance.now();

  // If Demo Mode is explicitly on, or no API key is provided, use high-quality simulated response
  if (isDemo || !apiKey) {
    // Artificial realistic delay (1.2s to 1.8s) to simulate network processing
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Check if code matches one of our preset samples (with newline normalization for Windows)
    const norm = (str) => (str || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const normalizedCode = norm(code);

    const matchedSample = SAMPLE_CODES.find((s) => {
      const normSample = norm(s.code);
      return (
        normalizedCode.includes(normSample.substring(0, 30)) ||
        normSample.includes(normalizedCode.substring(0, 30))
      );
    });

    if (matchedSample) {
      const elapsed = Math.round(performance.now() - startTime);
      const beginnerText = matchedSample.mockExplanation.beginner;
      const detailedText = matchedSample.mockExplanation.detailed;
      const interviewText = matchedSample.mockExplanation.interview;
      
      let mainText;
      let detailedOutput;

      if (level === 'beginner') {
        mainText = beginnerText;
        detailedOutput = null;
      } else if (level === 'interview') {
        mainText = interviewText || detailedText;
        detailedOutput = `${detailedText}\n\n---\n\n${interviewText || '### 📊 Complexity & Technical Analysis\n- **Time Complexity**: $\\mathcal{O}(N)$ or logarithmic depending on input scale.\n- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory.\n- **Edge Cases**: Empty collection, boundary index, type mismatch.'}`;
      } else if (level === 'code-review') {
        const codeReviewText = `### ✨ Code Quality & Best Practices Review\n- **Readability & Conventions**: Follows modern idioms with clean scope encapsulation.\n- **Refactoring Tip**: Prefer immutability and early returns to reduce indentation depth.\n- **SOLID Principles**: Adheres to Single Responsibility; logic is decoupled from side-effects.`;
        mainText = codeReviewText;
        detailedOutput = `${detailedText}\n\n---\n\n${codeReviewText}`;
      } else if (level === 'security') {
        const securityText = `### 🛡️ Defensive Coding & Security Audit\n- **Input Sanitization**: Always validate boundary bounds and nullish arguments before processing.\n- **Side Effects**: Verify external state mutations and asynchronous unhandled rejections.\n- **Exception Hardening**: Wrap untrusted calls in defensive try-catch boundaries.`;
        mainText = securityText;
        detailedOutput = `${detailedText}\n\n---\n\n${securityText}`;
      } else {
        mainText = detailedText;
        detailedOutput = detailedText;
      }

      return {
        explanation: mainText,
        basicExplanation: beginnerText,
        detailedExplanation: detailedOutput,
        purpose: matchedSample.purpose || 'Demonstrates essential algorithmic design and logical problem-solving.',
        sampleId: matchedSample.id,
        isDemo: true,
        model: `${model} (Demo Simulation)`,
        latencyMs: elapsed
      };
    }

    // Generic fallback mock for arbitrary custom code pasted in demo mode
    const lines = code.trim().split('\n').length;
    const elapsed = Math.round(performance.now() - startTime);

    const basicFallback = `### 🎯 Simple Summary
This code is written in **${language.toUpperCase()}** (${lines} line${lines > 1 ? 's' : ''}). It coordinates inputs, processes operations sequentially, and returns a predictable result.

---

### 🔍 Intuitive Real-World Analogy
Think of this snippet like an **automated workstation**: it receives specific inputs, verifies requirements against conditions, and produces a packaged outcome without unexpected side effects.

---

### 💡 Core Takeaway
It organizes logic into structured statements, making the execution flow clear, predictable, and maintainable.`;

    let specializedFallback = '';
    if (level === 'interview') {
      specializedFallback = `\n---\n\n### 📊 Complexity & Technical Analysis\n- **Time Complexity**: $\\mathcal{O}(N)$ proportional to iteration depth or instructions executed.\n- **Space Complexity**: $\\mathcal{O}(1)$ to $\\mathcal{O}(N)$ depending on intermediate allocations.\n- **Edge Cases**: Verify behavior on empty inputs, boundary values, or unexpected types.`;
    } else if (level === 'code-review') {
      specializedFallback = `\n---\n\n### ✨ Clean Code & Refactoring Review\n- **Readability**: Ensure expressive naming conventions for all variables and functions.\n- **Maintainability**: Deconstruct complex compound statements into single-purpose helpers.\n- **Extensibility**: Design components to be open for extension but closed for modification.`;
    } else if (level === 'security') {
      specializedFallback = `\n---\n\n### 🛡️ Defensive Security & Audit\n- **Input Boundary Guards**: Guard against null, undefined, NaN, and unexpected payload shapes.\n- **Defensive Execution**: Ensure timeouts and resource limits are imposed on recurring operations.\n- **State Isolation**: Protect scoped variables from global leakage or prototype pollution.`;
    }

    const detailedFallback = `### 📌 High-Level Architecture & Purpose
The overarching purpose of this ${language} code is to encapsulate business logic or algorithmic computation into a clear, modular execution sequence. It maintains structured variables within its scope and coordinates deterministic control flow.

---

### ⚙️ Step-by-Step Logic Breakdown
- **Initialization & Scoping**: Variables and parameters are established to hold state and intermediate data.
- **Data Flow & Control Operations**: Statements evaluate conditions sequentially, ensuring branch paths are followed deterministically.
- **Output & Resolution**: The result is computed and returned or passed down to downstream consumer modules.

---

### ⚡ Practical Production Considerations
- **Separation of Concerns**: Kept modular so it can be tested in isolation.
- **Maintainability**: Clear naming conventions and deterministic control paths ensure straightforward debugging.${specializedFallback}`;

    return {
      explanation: level === 'beginner' ? basicFallback : detailedFallback,
      basicExplanation: basicFallback,
      detailedExplanation: level === 'beginner' ? null : detailedFallback,
      purpose: `Encapsulates ${language.toUpperCase()} logic to process data inputs and execute control-flow operations safely and predictably.`,
      isDemo: true,
      model: `${model} (Demo Simulation)`,
      latencyMs: elapsed
    };
  }

  // Real live OpenRouter API call
  const systemPrompt = buildSystemPrompt(level);
  const userContent = `Language: ${language}\n\nHere is the code to explain:\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
        'X-Title': 'AI Code Explainer'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: response.statusText } };
      }

      const status = response.status;
      const message = errorData?.error?.message || `Request failed with HTTP status ${status}`;

      if (status === 401) {
        throw new Error('Invalid OpenRouter API Key. Please verify your key in Settings or switch to Demo Mode.');
      } else if (status === 429) {
        throw new Error('OpenRouter rate limit reached or model quota full. Try selecting another free model or wait a moment.');
      } else {
        throw new Error(`OpenRouter API Error: ${message}`);
      }
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('The AI model returned an empty response. Please try again or switch models.');
    }

    let basicExplanation = rawContent;
    let detailedExplanation = rawContent;

    if (rawContent.includes('===DETAILED_ANALYSIS===')) {
      const parts = rawContent.split('===DETAILED_ANALYSIS===');
      basicExplanation = parts[0].trim();
      detailedExplanation = parts[1].trim();
    }

    // Extract purpose line if possible
    let purpose = '';
    const purposeMatch = (detailedExplanation || rawContent).match(/(?:purpose|problem this code solves|objective)[:\s*#]+([^\n]+)/i);
    if (purposeMatch && purposeMatch[1]?.trim()) {
      purpose = purposeMatch[1].trim().replace(/^[*_~`]+|[*_~`]+$/g, '');
    } else {
      const cleanLines = (detailedExplanation || rawContent)
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#') && !l.startsWith('---') && l.length > 20);
      purpose = cleanLines[0] ? (cleanLines[0].length > 180 ? cleanLines[0].slice(0, 177) + '...' : cleanLines[0]) : 'Executes algorithmic and data transformation logic within the application.';
    }

    return {
      explanation: level === 'beginner' ? basicExplanation : detailedExplanation,
      basicExplanation: basicExplanation,
      detailedExplanation: level === 'beginner' ? null : detailedExplanation,
      purpose,
      isDemo: false,
      model: data?.model || model,
      latencyMs: elapsed
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach OpenRouter API. Please check your internet connection or CORS settings.');
    }
    throw error;
  }
}
