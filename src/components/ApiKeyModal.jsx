import React, { useState } from 'react';
import { X, Key, ExternalLink, ShieldCheck, Sparkles, Check, Eye, EyeOff } from 'lucide-react';
import { POPULAR_MODELS } from '../services/openRouterService';

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  selectedModel,
  onSaveModel,
  isDemo,
  onToggleDemo
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [model, setModel] = useState(selectedModel || 'meta-llama/llama-3.2-3b-instruct:free');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    onSaveModel(model);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#0F1C1B] border border-[#1E3B37] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3B37] bg-[#0A1313]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#116466]/20 text-[#2DE2C4] border border-[#2DE2C4]/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">OpenRouter API Settings</h2>
              <p className="text-xs text-[#8EABA3]">Configure your AI model and authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8EABA3] hover:text-white hover:bg-[#152B28] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Demo Mode Toggle Card */}
          <div className="p-4 rounded-xl bg-[#0A1313] border border-[#1E3B37] flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FFCB9A]/10 text-[#FFCB9A] border border-[#FFCB9A]/20 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#D1E8E2]">Interactive Demo Mode</h3>
                <p className="text-xs text-[#8EABA3] mt-0.5">
                  Test instant AI explanations for sample code without entering an API key.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input 
                type="checkbox" 
                checked={isDemo} 
                onChange={(e) => onToggleDemo(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-[#172D29] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2DE2C4]"></div>
            </label>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#8EABA3] uppercase tracking-wider mb-2">
              Select AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0A1313] border border-[#1E3B37] rounded-xl text-sm text-[#D1E8E2] focus:outline-none focus:border-[#2DE2C4]/60 focus:ring-1 focus:ring-[#2DE2C4]/40"
            >
              {POPULAR_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#8EABA3] uppercase tracking-wider">
                OpenRouter API Key
              </label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#2DE2C4] hover:text-[#5EF0D8] underline underline-offset-2"
              >
                <span>Get free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full pl-3.5 pr-20 py-2.5 bg-[#0A1313] border border-[#1E3B37] rounded-xl text-sm text-[#D1E8E2] placeholder-[#4D6E68] focus:outline-none focus:border-[#2DE2C4]/60 focus:ring-1 focus:ring-[#2DE2C4]/40 font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-[#8EABA3] hover:text-white rounded transition"
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex items-start gap-2 text-xs text-[#8EABA3]">
              <ShieldCheck className="w-4 h-4 text-[#2DE2C4] shrink-0 mt-0.5" />
              <span>
                Your API key is stored <strong>locally in your browser's localStorage</strong>. It is never logged or transmitted to any server other than OpenRouter.
              </span>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-[#1E3B37]">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
              >
                Remove Saved Key
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#8EABA3] hover:text-white hover:bg-[#152B28] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#D1E8E2] bg-gradient-to-r from-[#116466] to-[#168377] hover:from-[#147970] hover:to-[#1DA091] transition shadow-md shadow-[#116466]/40 border border-[#2DE2C4]/40"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-[#2DE2C4]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
