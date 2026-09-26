import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import CodeInputSection from './components/CodeInputSection';
import ExplanationOutputSection from './components/ExplanationOutputSection';
import ApiKeyModal from './components/ApiKeyModal';
import HistoryModal from './components/HistoryModal';
import Footer from './components/Footer';
import MagicCard, { GlobalSpotlight } from './components/MagicCard';
import LetterGlitch from './components/LetterGlitch';
import DetailedAnalysisSection from './components/DetailedAnalysisSection';
import { SAMPLE_CODES } from './data/sampleCodes';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredModel, 
  setStoredModel, 
  getIsDemoMode, 
  setIsDemoMode, 
  explainCode 
} from './services/openRouterService';

const HISTORY_STORAGE_KEY = 'code_explainer_history';

export default function App() {
  const workspaceRef = useRef(null);

  // Preload with the first sample snippet so reviewers can try immediately!
  const [code, setCode] = useState(SAMPLE_CODES[0].code);
  const [language, setLanguage] = useState(SAMPLE_CODES[0].language);
  const [level, setLevel] = useState('detailed');

  // Request & Output States
  const [isLoading, setIsLoading] = useState(false);
  const [explanationData, setExplanationData] = useState(() => {
    const initialSample = SAMPLE_CODES[0];
    return {
      explanation: initialSample.mockExplanation.detailed,
      basicExplanation: initialSample.mockExplanation.beginner,
      detailedExplanation: initialSample.mockExplanation.detailed,
      purpose: initialSample.purpose,
      sampleId: initialSample.id,
      isDemo: true,
      model: 'Meta Llama 3.2 3B',
      latencyMs: 120
    };
  });
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Configuration States
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [selectedModel, setSelectedModel] = useState(getStoredModel());
  const [isDemo, setIsDemo] = useState(getIsDemoMode());

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Code input validation
  const validateInput = () => {
    if (!code || !code.trim()) {
      setValidationError('Please enter or paste some code before requesting an explanation.');
      return false;
    }

    if (code.trim().length < 5) {
      setValidationError('The entered code is too short. Please provide a meaningful code snippet (at least 5 characters).');
      return false;
    }

    setValidationError(null);
    return true;
  };

  // Main Explain handler
  const handleExplain = async () => {
    // 1. JavaScript input validation
    if (!validateInput()) {
      return;
    }

    // 2. Clear previous errors and initiate "Analyzing code..." loading state
    setError(null);
    setIsLoading(true);

    try {
      // 3. Connect to OpenRouter API (or demo simulation)
      const result = await explainCode({
        code,
        language,
        level,
        apiKey,
        model: selectedModel,
        isDemo
      });

      // 4. Update output dynamically
      setExplanationData(result);

      // 5. Append to history (keep top 20 items)
      const newHistoryItem = {
        id: Date.now().toString(),
        code,
        language,
        level,
        explanation: result.explanation,
        basicExplanation: result.basicExplanation,
        detailedExplanation: result.detailedExplanation,
        purpose: result.purpose,
        timestamp: new Date().toISOString()
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while analyzing the code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamically update data if user changes level on an already loaded sample snippet
  const handleChangeLevel = (newLevel) => {
    setLevel(newLevel);

    const norm = (str) => (str || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const currentCode = norm(code);
    const matchedSample = SAMPLE_CODES.find(
      (s) => explanationData?.sampleId === s.id || currentCode.includes(norm(s.code).substring(0, 30))
    );

    if (matchedSample) {
      const beginnerText = matchedSample.mockExplanation.beginner;
      const detailedText = matchedSample.mockExplanation.detailed;
      const interviewText = matchedSample.mockExplanation.interview;

      let detailedOutput;
      if (newLevel === 'interview') {
        detailedOutput = `${detailedText}\n\n---\n\n${interviewText}`;
      } else {
        detailedOutput = detailedText;
      }

      setExplanationData({
        explanation: newLevel === 'beginner' ? beginnerText : detailedOutput,
        basicExplanation: beginnerText,
        detailedExplanation: newLevel === 'beginner' ? null : detailedOutput,
        purpose: matchedSample.purpose,
        sampleId: matchedSample.id,
        isDemo: true,
        model: selectedModel || 'Meta Llama 3.2 3B',
        latencyMs: 120
      });
    } else if (explanationData) {
      setExplanationData((prev) => ({
        ...prev,
        detailedExplanation: newLevel === 'beginner' ? null : (prev.detailedExplanation || prev.explanation)
      }));
    }
  };

  // Instant one-click sample loader that immediately renders code & explanation
  const handleSelectSampleSnippet = (sampleId) => {
    const sample = SAMPLE_CODES.find((s) => s.id === sampleId);
    if (sample) {
      setCode(sample.code);
      setLanguage(sample.language);
      setValidationError(null);
      setError(null);

      const beginnerText = sample.mockExplanation.beginner;
      const detailedText = sample.mockExplanation.detailed;
      const interviewText = sample.mockExplanation.interview;

      let detailedOutput;
      if (level === 'interview') {
        detailedOutput = `${detailedText}\n\n---\n\n${interviewText}`;
      } else {
        detailedOutput = detailedText;
      }

      setExplanationData({
        explanation: level === 'beginner' ? beginnerText : detailedOutput,
        basicExplanation: beginnerText,
        detailedExplanation: level === 'beginner' ? null : detailedOutput,
        purpose: sample.purpose,
        sampleId: sample.id,
        isDemo: true,
        model: selectedModel || 'Meta Llama 3.2 3B',
        latencyMs: 120
      });
    }
  };

  const handleClearCode = () => {
    setCode('');
    setValidationError(null);
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    setStoredApiKey(newKey);
  };

  const handleSaveModel = (newModel) => {
    setSelectedModel(newModel);
    setStoredModel(newModel);
  };

  const handleToggleDemo = (newDemoVal) => {
    setIsDemo(newDemoVal);
    setIsDemoMode(newDemoVal);
  };

  const handleSelectHistoryItem = (item) => {
    setCode(item.code);
    setLanguage(item.language);
    setLevel(item.level || 'detailed');
    setExplanationData({
      explanation: item.explanation,
      basicExplanation: item.basicExplanation || item.explanation,
      detailedExplanation: item.detailedExplanation || item.explanation,
      purpose: item.purpose || '',
      isDemo: false,
      model: selectedModel,
      latencyMs: 120
    });
    setError(null);
    setValidationError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  return (
    <div className="relative min-h-screen bg-[#0A1313] text-[#D1E8E2] font-sans overflow-x-hidden">
      
      {/* Background Matrix LetterGlitch Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          glitchColors={['#116466', '#2DE2C4', '#2C3531', '#D9B08C', '#478789']}
          backgroundColor="#0A1313"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <Navbar
          hasApiKey={Boolean(apiKey)}
          isDemo={isDemo}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          historyCount={history.length}
          selectedModel={selectedModel}
        />

      {/* Main Workspace (Centered & Enlarged, Fully Responsive) */}
      <main className="flex-1 w-full max-w-[1500px] 2xl:max-w-[1620px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 flex flex-col justify-center items-center">
        <div className="w-full my-auto flex flex-col justify-center">
          
          {/* Banner Alert if neither Key nor Demo is configured */}
          {!apiKey && !isDemo && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#116466]/30 via-[#132220] to-[#0A1313] border border-[#2DE2C4]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#2DE2C4] animate-ping"></span>
                <p className="text-[#D1E8E2]">
                  <strong className="text-[#2DE2C4]">Welcome!</strong> You can use your free <strong>OpenRouter API Key</strong> or switch to <strong>Demo Mode</strong> to test instantly.
                </p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleDemo(true)}
                  className="px-3 py-1.5 rounded-lg font-medium text-xs bg-[#132220] hover:bg-[#1A2E2C] text-[#D1E8E2] border border-[#1E3B37] transition cursor-pointer"
                >
                  Enable Demo Mode
                </button>
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-gradient-to-r from-[#116466] to-[#168377] hover:from-[#147970] hover:to-[#1DA091] text-[#D1E8E2] border border-[#2DE2C4]/40 shadow-sm shadow-[#116466]/40 transition cursor-pointer"
                >
                  Enter API Key
                </button>
              </div>
            </div>
          )}

          {/* Main Interactive Bento Workspace */}
          <div ref={workspaceRef} className="bento-section w-full relative">
            <GlobalSpotlight
              gridRef={workspaceRef}
              spotlightRadius={480}
              glowColor="45, 226, 196"
            />

            {/* 2-Column Responsive Layout for Code Input & Alongside Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch w-full">

              {/* Left Column: Code Input & Controls (Cyber Teal Glow) */}
              <section className="min-h-[520px] h-[600px] sm:h-[660px] md:h-[700px] lg:h-[780px] xl:h-[820px] w-full">
                <MagicCard
                  className="h-full"
                  glowColor="45, 226, 196"
                  enableStars={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={false}
                  clickEffect={true}
                  particleCount={12}
                >
                  <CodeInputSection
                    code={code}
                    onChangeCode={(newCode) => {
                      setCode(newCode);
                      if (validationError) setValidationError(null);
                    }}
                    language={language}
                    onChangeLanguage={setLanguage}
                    level={level}
                    onChangeLevel={handleChangeLevel}
                    onExplain={handleExplain}
                    isLoading={isLoading}
                    validationError={validationError}
                    onClear={handleClearCode}
                    onSelectSample={handleSelectSampleSnippet}
                  />
                </MagicCard>
              </section>

              {/* Right Column: Dynamic AI Explanation Output (Warm Copper & Amber Glow) */}
              <section className="min-h-[520px] h-[600px] sm:h-[660px] md:h-[700px] lg:h-[780px] xl:h-[820px] w-full">
                <MagicCard
                  className="h-full"
                  glowColor="217, 176, 140"
                  enableStars={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={false}
                  clickEffect={true}
                  particleCount={12}
                >
                  <ExplanationOutputSection
                    explanationData={explanationData}
                    isLoading={isLoading}
                    error={error}
                    level={level}
                    onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                    onEnableDemoMode={() => {
                      handleToggleDemo(true);
                      handleExplain();
                    }}
                  />
                </MagicCard>
              </section>

            </div>

            {/* Third Card: Full Detailed Breakdown & Code Purpose (width equal to total width of the 2 cards) */}
            {level !== 'beginner' && (
              <div className="mt-6 lg:mt-8 w-full transition-all duration-500 animate-fadeIn">
                <section className="min-h-[460px] lg:min-h-[500px] w-full">
                  <MagicCard
                    className="h-full"
                    glowColor="17, 100, 102"
                    enableStars={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={false}
                    clickEffect={true}
                    particleCount={16}
                  >
                    <DetailedAnalysisSection
                      explanationData={explanationData}
                      isLoading={isLoading}
                      error={error}
                      level={level}
                    />
                  </MagicCard>
                </section>
              </div>
            )}

          </div>

        </div>
      </main>

        {/* Developer Footer */}
        <Footer />
      </div>

      {/* Global Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
        onSaveModel={handleSaveModel}
        isDemo={isDemo}
        onToggleDemo={handleToggleDemo}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}
