import React, { useRef, useState, useEffect } from 'react';
import { 
  Trash2, 
  ClipboardPaste, 
  Sparkles, 
  AlertCircle,
  ChevronDown,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { SAMPLE_CODES, SUPPORTED_LANGUAGES, EXPLANATION_LEVELS } from '../data/sampleCodes';

export default function CodeInputSection({
  code,
  onChangeCode,
  language,
  onChangeLanguage,
  level,
  onChangeLevel,
  onExplain,
  isLoading,
  validationError,
  onClear,
  onSelectSample
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const depthDropdownRef = useRef(null);
  const [isDepthDropdownOpen, setIsDepthDropdownOpen] = useState(false);

  const currentLevelObj = EXPLANATION_LEVELS.find((lvl) => lvl.id === level) || EXPLANATION_LEVELS[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (depthDropdownRef.current && !depthDropdownRef.current.contains(event.target)) {
        setIsDepthDropdownOpen(false);
      }
    };
    if (isDepthDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDepthDropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDepthDropdownOpen(false);
      }
    };
    if (isDepthDropdownOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDepthDropdownOpen]);

  // Sync scroll of line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to trigger explanation
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading) {
        onExplain();
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeCode(text);
      }
    } catch {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleSelectSample = (sampleId) => {
    if (onSelectSample) {
      onSelectSample(sampleId);
    } else {
      const sample = SAMPLE_CODES.find((s) => s.id === sampleId);
      if (sample) {
        onChangeCode(sample.code);
        onChangeLanguage(sample.language);
      }
    }
  };

  const lines = code ? code.split('\n') : [''];
  const lineCount = lines.length;

  return (
    <div className="flex flex-col h-full bg-[#0F1C1B]/95 overflow-hidden backdrop-blur-sm">
      
      {/* Top Bar: Language & Samples & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-[#1E3B37] bg-[#0A1313]/80">
        
        {/* Left: Language & Samples */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 max-w-full">
          {/* Language Selector */}
          <div className="relative shrink-0">
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="appearance-none pl-2.5 pr-7 py-1.5 text-xs font-medium rounded-lg bg-[#132220] border border-[#1E3B37] text-[#D1E8E2] hover:border-[#2C524C] focus:outline-none focus:border-[#2DE2C4]/60 transition cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#8EABA3] pointer-events-none" />
          </div>

          {/* Sample Snippet Dropdown */}
          <div className="relative flex-1 min-w-0 max-w-[190px] xs:max-w-[220px] sm:max-w-[280px] md:max-w-none">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleSelectSample(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="w-full truncate appearance-none pl-2.5 pr-7 py-1.5 text-xs font-medium rounded-lg bg-[#116466]/40 text-[#D1E8E2] border border-[#2DE2C4]/40 hover:bg-[#116466]/60 focus:outline-none transition cursor-pointer"
            >
              <option value="" disabled>
                💡 Load Sample...
              </option>
              {SAMPLE_CODES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#2DE2C4] pointer-events-none" />
          </div>
        </div>

        {/* Right: Quick Edit Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md text-xs font-medium text-[#D1E8E2] hover:text-white bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] transition cursor-pointer"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-[#8EABA3]" />
            <span className="hidden min-[420px]:inline"></span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!code}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md text-xs font-medium text-[#8EABA3] hover:text-[#2DE2C4] bg-[#132220] hover:bg-[#1A2E2C] border border-[#1E3B37] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="Clear code"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden min-[420px]:inline"></span>
          </button>
        </div>

      </div>

      {/* Code Editor Container */}
      <div className="relative flex-1 min-h-[300px] flex overflow-hidden bg-[#0A1313]/95 font-mono text-sm">
        
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-3.5 pl-3 pr-2 text-right text-[#4D6E68] bg-[#081010] border-r border-[#152B28] font-mono text-xs leading-[1.625rem] overflow-hidden"
          style={{ width: '3rem' }}
        >
          {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Main Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder="// Paste or write your code here...&#10;// Example:&#10;function calculateTotal(items) {&#10;  return items.reduce((sum, item) => sum + item.price, 0);&#10;}"
          spellCheck="false"
          className="flex-1 w-full h-full p-3.5 bg-transparent text-[#D1E8E2] placeholder-[#4D6E68] resize-none focus:outline-none font-mono text-xs sm:text-sm leading-[1.625rem] overflow-y-auto whitespace-pre tab-4"
        />

      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="px-4 py-2 bg-rose-950/70 border-t border-rose-800/60 text-rose-200 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Explanation Tone / Level Selector (Interactive Dropdown Option List) */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-[#1E3B37] bg-[#0C1717] relative">
        <div className="flex items-center justify-between mb-2">
          <label 
            htmlFor="depth-style-dropdown"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8EABA3] uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2DE2C4]" />
            <span>Explanation Depth / Style:</span>
          </label>

          {/* Quick-switch Mini Pills */}
          <div className="hidden xs:flex items-center gap-1">
            {EXPLANATION_LEVELS.map((lvl) => {
              const isSelected = level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onChangeLevel(lvl.id)}
                  title={`${lvl.label} - ${lvl.desc}`}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#116466] text-[#2DE2C4] border border-[#2DE2C4]/60 font-semibold'
                      : 'bg-[#132220] text-[#63857F] hover:text-[#D1E8E2] border border-[#1E3B37]'
                  }`}
                >
                  {lvl.shortBadge || lvl.badge}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdown Container */}
        <div ref={depthDropdownRef} className="relative w-full">
          
          {/* Main Dropdown Trigger Button */}
          <button
            id="depth-style-dropdown"
            type="button"
            onClick={() => setIsDepthDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isDepthDropdownOpen}
            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 sm:py-2.5 rounded-xl border text-left transition cursor-pointer ${
              isDepthDropdownOpen
                ? 'bg-[#152725] border-[#2DE2C4] text-[#D1E8E2] ring-1 ring-[#2DE2C4]/40 shadow-lg shadow-[#116466]/20'
                : 'bg-[#132220] border-[#1E3B37] text-[#D1E8E2] hover:border-[#2C524C] hover:bg-[#162927]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-[#1A2E2C] text-[#FFCB9A] font-medium border border-[#284945]">
                {currentLevelObj.badge}
              </span>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                  {currentLevelObj.label}
                </span>
                <p className="text-[11px] text-[#8EABA3] truncate hidden min-[380px]:block">
                  {currentLevelObj.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-1 text-[#8EABA3]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4D6E68] hidden sm:inline">
                Change
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-[#2DE2C4] transition-transform duration-200 ${
                  isDepthDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </button>

          {/* Floating Dropdown Option List (Opens upwards over editor so it is never clipped) */}
          {isDepthDropdownOpen && (
            <div 
              role="listbox"
              aria-label="Explanation depth and style options"
              className="absolute bottom-full left-0 right-0 mb-2 max-h-72 sm:max-h-80 overflow-y-auto bg-[#0A1414]/98 border border-[#2DE2C4]/50 rounded-xl shadow-2xl shadow-black/90 backdrop-blur-md z-50 divide-y divide-[#182C29] animate-fadeIn"
            >
              {/* Option List Header */}
              <div className="px-3.5 py-2 bg-[#081010] text-[10px] font-semibold uppercase tracking-wider text-[#8EABA3] flex items-center justify-between sticky top-0 z-10 border-b border-[#1E3B37]">
                <span>Choose Explanation Depth & Style</span>
                <span className="text-[#2DE2C4] font-mono">
                  {EXPLANATION_LEVELS.length} styles available
                </span>
              </div>

              {/* Option Items */}
              <div className="p-1.5 space-y-1">
                {EXPLANATION_LEVELS.map((lvl) => {
                  const isSelected = level === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChangeLevel(lvl.id);
                        setIsDepthDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-lg text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#116466]/40 to-[#142C29] border border-[#2DE2C4]/60 text-white shadow-sm'
                          : 'bg-transparent hover:bg-[#132422] text-[#8EABA3] hover:text-[#D1E8E2] border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="shrink-0 text-xs px-2 py-0.5 rounded bg-[#1A2E2C] text-[#FFCB9A] font-mono border border-[#284945] mt-0.5">
                          {lvl.badge}
                        </span>
                        <div className="min-w-0">
                          <span className={`text-xs sm:text-sm font-semibold block ${isSelected ? 'text-[#2DE2C4]' : 'text-white'}`}>
                            {lvl.label}
                          </span>
                          <p className="text-[11px] text-[#8EABA3] mt-0.5 line-clamp-1">
                            {lvl.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right: Checkmark for Selected State */}
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#116466] border border-[#2DE2C4] flex items-center justify-center text-[#2DE2C4]">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#1E3B37] hover:border-[#2C524C]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Informative Footer in Dropdown */}
              <div className="px-3.5 py-2 bg-[#081010]/80 text-[10px] text-[#63857F] flex items-center justify-between border-t border-[#1E3B37]">
                <span>💡 Select any mode to adjust explanation detail</span>
                <span className="font-mono text-[#8EABA3]">Esc to close</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Stats & Big Submit Button */}
      <div className="px-4 py-3 border-t border-[#1E3B37] bg-[#0A1313] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-[#8EABA3]">
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span>•</span>
          <span>{code.length} characters</span>
          <span className="hidden lg:inline text-[#4D6E68]">• (Ctrl + Enter to run)</span>
        </div>

        <button
          type="button"
          onClick={onExplain}
          disabled={isLoading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg cursor-pointer ${
            isLoading
              ? 'bg-[#116466]/50 text-[#2DE2C4]/60 border border-[#2DE2C4]/30 cursor-wait'
              : 'bg-gradient-to-r from-[#116466] to-[#168377] hover:from-[#147970] hover:to-[#1DA091] text-[#D1E8E2] border border-[#2DE2C4]/40 shadow-[#116466]/40 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#2DE2C4]/30 border-t-[#2DE2C4] rounded-full animate-spin" />
              <span>Analyzing code...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#2DE2C4]" />
              <span>Explain Code</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
