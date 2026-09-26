import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Key, 
  History, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  Menu,
  X,
  Cpu,
  ChevronRight,
  Info
} from 'lucide-react';

export default function Navbar({
  hasApiKey,
  isDemo,
  onOpenApiKeyModal,
  onOpenHistory,
  historyCount = 0,
  selectedModel = 'meta-llama/llama-3.2-3b-instruct:free'
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lock body scroll when mobile/iPad sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // Clean friendly model name
  const modelDisplayName = selectedModel.includes('/') 
    ? selectedModel.split('/')[1].replace(':free', ' (Free)') 
    : selectedModel;

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-[#1E3B37] bg-[#0A1313]/95 backdrop-blur-md">
        <div className="w-full max-w-[1500px] 2xl:max-w-[1620px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#116466]/40 to-[#2DE2C4]/20 border border-[#2DE2C4]/50 text-[#2DE2C4] shadow-lg shadow-[#116466]/30 shrink-0">
              <Terminal className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2DE2C4] animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-[#D1E8E2]">
                  CodeSense<span className="text-[#2DE2C4]">.ai</span>
                </span>
              </div>
              <p className="text-xs text-[#8EABA3] hidden md:block">
                Interactive AI Code Explainer powered by OpenRouter
              </p>
            </div>
          </div>

          {/* Right: Desktop Actions (Visible on >= lg screens: Desktops & iPad landscape) */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Mode Pill Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#132220] border border-[#1E3B37] text-[#D1E8E2]">
              {isDemo ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFCB9A]" />
                  <span className="text-[#FFCB9A] font-semibold">Demo Mode</span>
                </>
              ) : hasApiKey ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DE2C4]" />
                  <span>Live OpenRouter API</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FFCB9A]" />
                  <span>API Key Not Set</span>
                </>
              )}
            </div>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[#D1E8E2] hover:text-white bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] hover:border-[#2C524C] transition cursor-pointer"
              title="View explanation history"
            >
              <History className="w-4 h-4 text-[#8EABA3]" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#116466] text-[#2DE2C4] border border-[#2DE2C4]/40">
                  {historyCount}
                </span>
              )}
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer border ${
                hasApiKey && !isDemo
                  ? 'bg-[#132220] text-[#D1E8E2] border-[#2DE2C4]/40 hover:bg-[#1A2E2C]'
                  : 'bg-gradient-to-r from-[#116466] to-[#168377] hover:from-[#147970] hover:to-[#1DA091] text-[#D1E8E2] border-[#2DE2C4]/40 shadow-sm shadow-[#116466]/40 font-semibold'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-[#2DE2C4]" />
              <span>{hasApiKey && !isDemo ? 'API Key Active' : 'Configure API Key'}</span>
            </button>
          </div>

          {/* Right: Mobile / iPad Collapsed Header Button (< lg screens) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick status pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#132220] border border-[#1E3B37]">
              {isDemo ? (
                <span className="text-[#FFCB9A] flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#FFCB9A]" />
                  <span className="hidden sm:inline">Demo</span>
                </span>
              ) : hasApiKey ? (
                <span className="text-[#2DE2C4] flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2DE2C4] animate-pulse"></span>
                  <span className="hidden sm:inline">API Active</span>
                </span>
              ) : (
                <span className="text-[#FFCB9A] flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#FFCB9A]"></span>
                  <span className="hidden sm:inline">No Key</span>
                </span>
              )}
            </div>

            {/* Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              className="p-2 rounded-xl bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] text-[#D1E8E2] hover:text-[#2DE2C4] transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile / iPad Slide-over Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Panel */}
          <aside className="fixed top-0 right-0 h-full w-[310px] sm:w-[360px] max-w-[85vw] bg-[#0A1313] border-l border-[#1E3B37] z-50 flex flex-col justify-between p-5 shadow-2xl overflow-y-auto animate-slideInRight">
            
            {/* Top: Sidebar Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E3B37]">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#116466]/40 to-[#2DE2C4]/20 border border-[#2DE2C4]/40 text-[#2DE2C4]">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-base tracking-tight text-[#D1E8E2]">
                      CodeSense<span className="text-[#2DE2C4]">.ai</span>
                    </span>
                    <p className="text-[11px] text-[#8EABA3]">Navigation & Controls</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] text-[#8EABA3] hover:text-white transition cursor-pointer"
                  aria-label="Close navigation sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-[#116466]/25 to-[#132220] border border-[#2DE2C4]/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8EABA3] uppercase tracking-wider">
                    Current Mode
                  </span>
                  {isDemo ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FFCB9A]/10 text-[#FFCB9A] border border-[#FFCB9A]/30">
                      <Sparkles className="w-3 h-3" />
                      Demo Mode
                    </span>
                  ) : hasApiKey ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2DE2C4]/10 text-[#2DE2C4] border border-[#2DE2C4]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Live API
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                      <ShieldAlert className="w-3 h-3" />
                      No Key
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#D1E8E2] mt-2 leading-relaxed">
                  {isDemo 
                    ? 'Running with zero-cost instant AI simulation for sample codes.'
                    : hasApiKey 
                    ? 'Connected directly to OpenRouter Chat Completions endpoint.'
                    : 'Configure your free API key or enable Demo Mode to analyze code.'}
                </p>
              </div>

              {/* Navigation Action Buttons */}
              <div className="mt-5 space-y-2.5">
                
                {/* Configure API Key */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    onOpenApiKeyModal();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] hover:border-[#2DE2C4]/40 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#116466]/30 text-[#2DE2C4] group-hover:scale-105 transition">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-[#D1E8E2]">
                        {hasApiKey && !isDemo ? 'API Key Settings' : 'Configure API Key'}
                      </div>
                      <p className="text-[11px] text-[#8EABA3]">
                        {hasApiKey && !isDemo ? 'Key active & verified' : 'Add OpenRouter Key or select Model'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8EABA3] group-hover:text-[#2DE2C4] group-hover:translate-x-0.5 transition" />
                </button>

                {/* History */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    onOpenHistory();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] hover:border-[#2DE2C4]/40 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#116466]/30 text-[#2DE2C4] group-hover:scale-105 transition">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-[#D1E8E2] flex items-center gap-2">
                        <span>Explanation History</span>
                        {historyCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#116466] text-[#2DE2C4] border border-[#2DE2C4]/40">
                            {historyCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8EABA3]">
                        {historyCount > 0 ? `${historyCount} saved snippet${historyCount > 1 ? 's' : ''}` : 'No saved explanations yet'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8EABA3] group-hover:text-[#2DE2C4] group-hover:translate-x-0.5 transition" />
                </button>

                {/* Active Model Info */}
                <div className="p-3 rounded-xl bg-[#0D1818] border border-[#1E3B37]/80">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#8EABA3]">
                    <Cpu className="w-3.5 h-3.5 text-[#2DE2C4]" />
                    <span>Active LLM Model</span>
                  </div>
                  <div className="mt-1 text-xs font-mono font-semibold text-[#FFCB9A] truncate">
                    {modelDisplayName}
                  </div>
                </div>

              </div>

              {/* Quick Explainer Guide */}
              <div className="mt-5 p-3 rounded-xl bg-[#0A1313] border border-[#1E3B37] text-xs text-[#8EABA3] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#D1E8E2] font-semibold">
                  <Info className="w-3.5 h-3.5 text-[#2DE2C4]" />
                  <span>How it works</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  • <strong>Beginner</strong>: Quick summary with intuitive analogies.
                </p>
                <p className="text-[11px] leading-relaxed">
                  • <strong>In-Depth Styles</strong>: Full architectural breakdown, code purpose & deep analysis.
                </p>
              </div>

            </div>

            {/* Bottom: Sidebar Footer */}
            <div className="pt-4 mt-6 border-t border-[#1E3B37] text-center text-[11px] text-[#63857F]">
              <span>CodeSense AI • Mobile & iPad Optimized</span>
            </div>

          </aside>

        </div>
      )}
    </>
  );
}
