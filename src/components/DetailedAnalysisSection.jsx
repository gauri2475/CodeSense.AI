import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  VolumeX, 
  Zap, 
  Compass, 
  Cpu, 
  Layers,
  Code,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function DetailedAnalysisSection({
  explanationData,
  isLoading,
  error,
  level = 'detailed'
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const contentToDisplay = explanationData?.detailedExplanation || explanationData?.explanation;
  const purposeToDisplay = explanationData?.purpose;

  const handleCopy = async () => {
    if (!contentToDisplay) return;
    try {
      const fullText = purposeToDisplay 
        ? `### 🎯 Purpose of this Code\n${purposeToDisplay}\n\n---\n\n${contentToDisplay}`
        : contentToDisplay;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!contentToDisplay) return;
    const fullText = purposeToDisplay 
      ? `# Code Analysis & Purpose\n\n## 🎯 Purpose of this Code\n${purposeToDisplay}\n\n---\n\n${contentToDisplay}`
      : contentToDisplay;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `detailed-code-analysis-${level}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const raw = `${purposeToDisplay ? `Purpose: ${purposeToDisplay}. ` : ''}${contentToDisplay}`;
    const cleanText = raw
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

  return (
    <div id="detailed-card" className="flex flex-col h-full bg-[#0F1C1B]/95 overflow-hidden backdrop-blur-sm">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#1E3B37] bg-[#0A1313]/90">
        
        {/* Left: Icon, Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#116466]/40 to-[#2DE2C4]/20 text-[#2DE2C4] border border-[#2DE2C4]/40 shadow-sm shadow-[#116466]/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Full Detailed Breakdown & Code Purpose
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#116466]/30 text-[#2DE2C4] border border-[#2DE2C4]/30">
                {level === 'interview' && (
                  <>
                    <Cpu className="w-3 h-3 text-[#FFCB9A]" />
                    <span className="text-[#FFCB9A]">Deep Dive & Big-O</span>
                  </>
                )}
                {level === 'code-review' && (
                  <>
                    <Sparkles className="w-3 h-3 text-[#2DE2C4]" />
                    <span className="text-[#2DE2C4]">Clean Code Review</span>
                  </>
                )}
                {level === 'security' && (
                  <>
                    <AlertTriangle className="w-3 h-3 text-[#FF7582]" />
                    <span className="text-[#FF7582]">Security & Edge Cases</span>
                  </>
                )}
                {(level === 'detailed' || !['interview', 'code-review', 'security'].includes(level)) && (
                  <>
                    <Layers className="w-3 h-3 text-[#2DE2C4]" />
                    <span>Standard Architecture</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-[11px] text-[#8EABA3]">
              Expanded architectural analysis, step-by-step logic, and functional purpose
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {explanationData && !isLoading && (
            <>
              {explanationData.latencyMs && (
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono bg-[#132220] text-[#D9B08C] border border-[#1E3B37]">
                  <Zap className="w-3 h-3 text-[#FFCB9A]" />
                  {explanationData.latencyMs}ms
                </span>
              )}

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
                  title={isSpeaking ? 'Stop voice reading' : 'Read detailed analysis aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              {/* Copy */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#D1E8E2] hover:text-white bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] transition cursor-pointer"
                title="Copy detailed breakdown"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2DE2C4]" />
                    <span className="text-[#2DE2C4]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8EABA3]" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Download */}
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#D1E8E2] hover:text-white bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] transition cursor-pointer"
                title="Export as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-[#8EABA3]" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[640px]">
        
        {/* State 1: Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#2DE2C4]/10 border border-[#2DE2C4]/30 animate-ping absolute inset-0"></div>
              <div className="w-16 h-16 rounded-full bg-[#0A1313] border border-[#2DE2C4]/40 flex items-center justify-center relative shadow-xl shadow-[#2DE2C4]/20">
                <Sparkles className="w-7 h-7 text-[#2DE2C4] animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Synthesizing Detailed Architecture & Purpose...
              </h3>
              <p className="text-xs text-[#2DE2C4] font-mono mt-1.5">
                Analyzing mechanics, control flows, and edge cases
              </p>
            </div>
            <div className="w-full max-w-xl space-y-3 pt-2 opacity-50">
              <div className="h-4 bg-[#172D29] rounded-md animate-pulse w-full"></div>
              <div className="h-4 bg-[#172D29] rounded-md animate-pulse w-5/6 mx-auto"></div>
              <div className="h-4 bg-[#172D29] rounded-md animate-pulse w-4/6 mx-auto"></div>
            </div>
          </div>
        )}

        {/* State 2: Error State */}
        {!isLoading && error && (
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/50 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-rose-200">Unable to generate detailed breakdown</h3>
                <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Content Loaded */}
        {!isLoading && !error && contentToDisplay && (
          <div className="space-y-6">
            
            {/* Prominent Code Purpose Banner */}
            {purposeToDisplay && (
              <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#116466]/25 via-[#132220] to-[#0A1313] border border-[#2DE2C4]/40 shadow-lg shadow-[#116466]/20">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#2DE2C4]/15 border border-[#2DE2C4]/40 text-[#2DE2C4] shrink-0 mt-0.5">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2DE2C4]">
                        Primary Purpose & Architectural Objective
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#D1E8E2] leading-relaxed font-medium">
                      {purposeToDisplay}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Markdown Breakdown */}
            <div className="prose prose-invert max-w-none text-[#D1E8E2] text-sm leading-relaxed space-y-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (props) => <h1 className="text-xl font-bold text-white mt-5 mb-2 pb-1.5 border-b border-[#1E3B37]" {...props} />,
                  h2: (props) => <h2 className="text-lg font-bold text-white mt-4 mb-2 pb-1 border-b border-[#1E3B37]/60" {...props} />,
                  h3: (props) => <h3 className="text-base font-semibold text-[#2DE2C4] mt-4 mb-1.5" {...props} />,
                  p: (props) => <p className="mb-3 text-[#D1E8E2] leading-relaxed" {...props} />,
                  ul: (props) => <ul className="list-disc pl-5 space-y-1.5 mb-3 text-[#D1E8E2]" {...props} />,
                  ol: (props) => <ol className="list-decimal pl-5 space-y-1.5 mb-3 text-[#D1E8E2]" {...props} />,
                  li: (props) => <li className="leading-relaxed" {...props} />,
                  strong: (props) => <strong className="font-semibold text-white" {...props} />,
                  hr: () => <hr className="my-5 border-[#1E3B37]" />,
                  blockquote: (props) => (
                    <blockquote className="border-l-4 border-[#2DE2C4] pl-4 py-2 italic bg-[#116466]/20 rounded-r-lg my-3 text-[#D1E8E2]" {...props} />
                  ),
                  table: (props) => (
                    <div className="overflow-x-auto my-4 rounded-xl border border-[#1E3B37]">
                      <table className="min-w-full text-xs" {...props} />
                    </div>
                  ),
                  th: (props) => (
                    <th className="bg-[#132524] px-4 py-2.5 text-left font-semibold text-[#D1E8E2] border-b border-[#1E3B37]" {...props} />
                  ),
                  td: (props) => (
                    <td className="px-4 py-2.5 border-b border-[#162C2A] text-[#8EABA3]" {...props} />
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
                        <div className="flex items-center justify-between px-3.5 py-2 bg-[#0E1A1A] border-b border-[#1E3B37] text-[11px] text-[#8EABA3]">
                          <span className="flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-[#2DE2C4]" />
                            <span>Syntax & Logic Implementation</span>
                          </span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[#D1E8E2] leading-relaxed">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  }
                }}
              >
                {contentToDisplay}
              </ReactMarkdown>
            </div>

          </div>
        )}

        {/* State 4: Idle / Empty State */}
        {!isLoading && !error && !contentToDisplay && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#116466]/20 border border-[#1E3B37] flex items-center justify-center text-[#2DE2C4]">
              <Compass className="w-7 h-7 opacity-80" />
            </div>
            <div className="max-w-md">
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Detailed Analysis Ready
              </h3>
              <p className="text-xs text-[#8EABA3] mt-1 leading-relaxed">
                Click <strong className="text-[#2DE2C4]">"Explain Code"</strong> in the editor above to generate the full architectural breakdown, functional purpose, and mechanics.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
