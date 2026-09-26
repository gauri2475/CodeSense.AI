import React from 'react';
import { Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1E3B37] bg-[#0A1313]/90 py-6">
      <div className="w-full max-w-[1500px] 2xl:max-w-[1620px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8EABA3]">
        
        {/* Left: Project Info */}
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#2DE2C4]" />
          <span>
            <strong className="text-[#D1E8E2]">CodeSense AI</strong> • Interactive Code Explainer
          </span>
        </div>

        {/* Center: Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-[#132220] border border-[#1E3B37] text-[#8EABA3]">
            React 19
          </span>
          <span className="px-2 py-0.5 rounded bg-[#132220] border border-[#1E3B37] text-[#8EABA3]">
            JavaScript
          </span>
          <span className="px-2 py-0.5 rounded bg-[#132220] border border-[#1E3B37] text-[#8EABA3]">
            Tailwind CSS
          </span>
          <span className="px-2 py-0.5 rounded bg-[#132220] border border-[#1E3B37] text-[#2DE2C4]">
            OpenRouter API
          </span>
          <span className="px-2 py-0.5 rounded bg-[#132220] border border-[#1E3B37] text-[#D9B08C]">
            GSAP Physics
          </span>
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-1.5 text-[#8EABA3]">
          <span>Client-side validated & responsive</span>
        </div>

      </div>
    </footer>
  );
}
