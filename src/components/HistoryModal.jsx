import React from 'react';
import { X, History, Trash2, ArrowUpRight, Code, Clock } from 'lucide-react';

export default function HistoryModal({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#0F1C1B] border border-[#1E3B37] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3B37] bg-[#0A1313]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#116466]/20 text-[#2DE2C4] border border-[#2DE2C4]/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Explanation History</h2>
              <p className="text-xs text-[#8EABA3]">
                {history.length} {history.length === 1 ? 'item' : 'items'} saved locally
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8EABA3] hover:text-white hover:bg-[#152B28] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-[#63857F] text-sm">
              <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No explanation history yet.</p>
              <p className="text-xs mt-1 text-[#4D6E68]">
                Explanations you generate will automatically be saved here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="group p-4 rounded-xl bg-[#0A1313]/90 border border-[#1E3B37] hover:border-[#2DE2C4]/50 hover:bg-[#132524] transition cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-[#116466]/40 text-[#D1E8E2] border border-[#2DE2C4]/30">
                      {item.language}
                    </span>
                    <span className="text-[11px] text-[#D9B08C] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-[#8EABA3] capitalize">
                      • {item.level}
                    </span>
                  </div>
                  <pre className="font-mono text-xs text-[#8EABA3] truncate max-w-md bg-[#0D1818] px-2.5 py-1.5 rounded-lg border border-[#193330]">
                    {item.code.split('\n')[0] || '// Code snippet'}
                  </pre>
                </div>

                <div className="shrink-0 p-2 text-[#63857F] group-hover:text-[#2DE2C4] transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="px-6 py-3 border-t border-[#1E3B37] bg-[#0A1313]/80 flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-[#D1E8E2] hover:text-white bg-[#152B28] hover:bg-[#1E3B37] transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
