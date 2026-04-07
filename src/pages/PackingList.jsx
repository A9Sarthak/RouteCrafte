import React from 'react';

export default function PackingList() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex antialiased selection:bg-primary/30 selection:text-primary">
      <main className="flex-1 p-6 lg:p-10 max-w-full mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <span className="material-icons-outlined text-primary text-3xl">luggage</span>
            Interactive Packing List
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Use this tool to track your essential items. (Powered by standalone jQuery & Bootstrap)
          </p>
        </div>
        
        {/* Isolated iFrame to prevent Bootstrap global CSS from breaking Tailwind */}
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden" style={{ minHeight: '600px' }}>
          <iframe 
            src="/travel-tools.html" 
            title="Packing List Tool"
            className="w-full h-full border-0 min-h-[600px] block"
          />
        </div>
      </main>
    </div>
  );
}
