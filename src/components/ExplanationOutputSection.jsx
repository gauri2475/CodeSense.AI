import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  VolumeX, 
  Zap, 
  AlertTriangle,
  Lightbulb,
  Terminal,
  Code,
  Layers
} from 'lucide-react';

export default function ExplanationOutputSection({
  explanationData,
  isLoading,
  error,
  level = 'beginner',
  onOpenApiKeyModal,
  onEnableDemoMode
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  // Animated stages for the "Analyzing code..." loading state
  useEffect(() => {
    if (!isLoading) return;

    const stages = [0, 1, 2];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % stages.length;
      setActiveStage(currentIndex);
    }, 900);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  // Clean up speech synthesis when component unmounts or stops
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const isExpandedMode = level !== 'beginner';
  const textToDisplay = (isExpandedMode && explanationData?.basicExplanation)
    ? explanationData.basicExplanation
    : (explanationData?.explanation || explanationData?.basicExplanation);

  const handleCopy = async () => {
    if (!textToDisplay) return;
    try {
      await navigator.clipboard.writeText(textToDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!textToDisplay) return;
    const blob = new Blob([textToDisplay], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'code-explanation.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !textToDisplay) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for cleaner speech reading
    const cleanText = textToDisplay
      .replace(/#+\s+/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, 'code snippet')
      .replace(/[*_~-]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const loadingStages = [
    'Parsing input syntax & identifying patterns...',
    'Dispatching request to OpenRouter Chat API...',
    'Synthesizing plain-language breakdown...'
  ];

  return (
    <div className="flex flex-col h-full bg-[#0F1C1B]/95 overflow-hidden backdrop-blur-sm">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E3B37] bg-[#0A1313]/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#116466]/20 text-[#2DE2C4] border border-[#2DE2C4]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-[#D1E8E2]">
            {isExpandedMode ? 'Basic Summary & Core Purpose' : 'AI Explanation'}
          </h2>
          {isExpandedMode ? (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#116466]/30 text-[#2DE2C4] border border-[#2DE2C4]/30">
              👶 Beginner Overview
            </span>
          ) : (
            explanationData && !isLoading && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#132220] text-[#D9B08C] border border-[#1E3B37]">
                <Zap className="w-2.5 h-2.5 text-[#FFCB9A]" />
                {explanationData.latencyMs}ms
              </span>
            )
          )}
        </div>

        {/* Toolbar Buttons */}
        {explanationData && !isLoading && (
          <div className="flex items-center gap-1.5">
            {/* Text-to-Speech */}
            {typeof window !== 'undefined' && 'speechSynthesis' in window && (
              <button
                type="button"
                onClick={handleToggleSpeech}
                className={`p-1.5 rounded-lg text-xs font-medium border transition ${
                  isSpeaking
                    ? 'bg-[#116466]/30 text-[#2DE2C4] border-[#2DE2C4]/50 animate-pulse'
                    : 'bg-[#132220] text-[#8EABA3] hover:text-[#D1E8E2] border-[#1E3B37] hover:bg-[#1A2E2C]'
                }`}
                title={isSpeaking ? 'Stop voice reading' : 'Read aloud'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#D1E8E2] hover:text-white bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] transition cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2DE2C4]" />
                  <span className="text-[#2DE2C4]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            {/* Download Markdown */}
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-xs font-medium bg-[#132220] text-[#8EABA3] hover:text-[#D1E8E2] border border-[#1E3B37] hover:bg-[#1A2E2C] transition"
              title="Download as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto min-h-[420px]">
        
        {/* State 1: Loading state with "Analyzing code..." message */}
        {isLoading && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="w-20 h-20 rounded-full bg-[#2DE2C4]/10 border border-[#2DE2C4]/30 animate-ping absolute inset-0"></div>
              {/* Spinning core */}
              <div className="w-20 h-20 rounded-full bg-[#0A1313] border border-[#2DE2C4]/40 flex items-center justify-center relative shadow-xl shadow-[#2DE2C4]/20">
                <Sparkles className="w-8 h-8 text-[#2DE2C4] animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                <span>Analyzing code...</span>
              </h3>
              <p className="text-xs text-[#2DE2C4] font-mono mt-2 transition-all duration-300">
                {loadingStages[activeStage]}
              </p>
            </div>

            {/* Skeleton placeholders */}
            <div className="w-full max-w-md space-y-2.5 pt-4 opacity-50">
              <div className="h-3.5 bg-[#172D29] rounded-md animate-pulse w-3/4 mx-auto"></div>
              <div className="h-3.5 bg-[#172D29] rounded-md animate-pulse w-5/6 mx-auto"></div>
              <div className="h-3.5 bg-[#172D29] rounded-md animate-pulse w-2/3 mx-auto"></div>
            </div>
          </div>
        )}

        {/* State 2: Error state */}
        {!isLoading && error && (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/50 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-rose-200">Unable to generate explanation</h3>
                <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#116466] hover:bg-[#16787B] text-[#D1E8E2] border border-[#2DE2C4]/40 transition"
              >
                Configure API Key
              </button>
              <button
                type="button"
                onClick={onEnableDemoMode}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#132220] hover:bg-[#1A2E2C] text-[#D1E8E2] border border-[#1E3B37] transition"
              >
                Switch to Demo Mode (No Key Needed)
              </button>
            </div>
          </div>
        )}

        {/* State 3: Finished Explanation with Markdown Rendering */}
        {!isLoading && !error && explanationData && (
          <div className="prose prose-invert max-w-none text-[#D1E8E2] text-sm leading-relaxed space-y-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: (props) => <h1 className="text-xl font-bold text-white mt-4 mb-2 pb-1 border-b border-[#1E3B37]" {...props} />,
                h2: (props) => <h2 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                h3: (props) => <h3 className="text-base font-semibold text-[#2DE2C4] mt-4 mb-1.5" {...props} />,
                p: (props) => <p className="mb-3 text-[#D1E8E2] leading-relaxed" {...props} />,
                ul: (props) => <ul className="list-disc pl-5 space-y-1 mb-3 text-[#D1E8E2]" {...props} />,
                ol: (props) => <ol className="list-decimal pl-5 space-y-1 mb-3 text-[#D1E8E2]" {...props} />,
                li: (props) => <li className="leading-relaxed" {...props} />,
                strong: (props) => <strong className="font-semibold text-white" {...props} />,
                hr: () => <hr className="my-4 border-[#1E3B37]" />,
                blockquote: (props) => (
                  <blockquote className="border-l-4 border-[#2DE2C4] pl-4 py-1 italic bg-[#116466]/20 rounded-r-lg my-3 text-[#D1E8E2]" {...props} />
                ),
                table: (props) => (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full text-xs border border-[#1E3B37] rounded-lg overflow-hidden" {...props} />
                  </div>
                ),
                th: (props) => (
                  <th className="bg-[#132524] px-3 py-2 text-left font-semibold text-[#D1E8E2] border-b border-[#1E3B37]" {...props} />
                ),
                td: (props) => (
                  <td className="px-3 py-2 border-b border-[#162C2A] text-[#8EABA3]" {...props} />
                ),
                code: ({ inline, children, ...props }) => {
                  if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-[#152B28] text-[#2DE2C4] font-mono text-xs border border-[#1F413D]" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="relative my-3 rounded-xl overflow-hidden border border-[#1E3B37] bg-[#0A1313] font-mono text-xs">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0E1A1A] border-b border-[#1E3B37] text-[11px] text-[#8EABA3]">
                        <span className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-[#2DE2C4]" />
                          <span>Code snippet</span>
                        </span>
                      </div>
                      <pre className="p-3.5 overflow-x-auto text-[#D1E8E2] leading-relaxed">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                }
              }}
            >
              {textToDisplay}
            </ReactMarkdown>

            {/* Indicator linking down to the third card */}
            {isExpandedMode && (
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#116466]/20 via-[#132220] to-[#0A1313] border border-[#2DE2C4]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-[#D1E8E2]">
                  <Layers className="w-4 h-4 text-[#2DE2C4] shrink-0" />
                  <span>Full detailed breakdown & code purpose is active below</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('detailed-card')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#116466]/40 hover:bg-[#116466] text-[#2DE2C4] hover:text-white font-medium transition cursor-pointer text-[11px] shrink-0 self-end sm:self-auto"
                >
                  Scroll Down ↓
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 4: Idle / Empty state */}
        {!isLoading && !error && !explanationData && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#116466]/40 to-[#2DE2C4]/10 border border-[#1E3B37] flex items-center justify-center text-[#2DE2C4] shadow-inner">
              <Terminal className="w-8 h-8 opacity-80" />
            </div>

            <div className="max-w-sm">
              <h3 className="text-base font-semibold text-white">
                Ready to Explain Your Code
              </h3>
              <p className="text-xs text-[#8EABA3] mt-1.5 leading-relaxed">
                Paste any code snippet on the left or click <strong className="text-white">"Load Sample Snippet"</strong> to test it immediately.
              </p>
            </div>

            {/* Quick feature pill cards with warm copper/peach and mint accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md text-left">
              <div className="p-3 rounded-xl bg-[#0A1313]/90 border border-[#1E3B37]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#D1E8E2]">
                  <Lightbulb className="w-4 h-4 text-[#FFCB9A]" />
                  <span>Beginner to Big-O</span>
                </div>
                <p className="text-[11px] text-[#63857F] mt-1">
                  Tailor depth from ELI5 to technical interview complexity.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0A1313]/90 border border-[#1E3B37]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#D1E8E2]">
                  <Sparkles className="w-4 h-4 text-[#2DE2C4]" />
                  <span>OpenRouter Live AI</span>
                </div>
                <p className="text-[11px] text-[#63857F] mt-1">
                  Connect free LLM models or test with instant demo mode.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
