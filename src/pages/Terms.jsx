import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 md:p-14 border border-slate-100 dark:border-slate-700">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: April 2026</p>
        
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
          <p>
            By accessing the website at RouteCraft, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3">1. Use License</h3>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on RouteCraft's website for personal, non-commercial transitory viewing only.
          </p>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3">2. Disclaimer</h3>
          <p>
            The materials on RouteCraft's website are provided on an 'as is' basis. RouteCraft makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3">3. Limitations</h3>
          <p>
            In no event shall RouteCraft or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RouteCraft's website.
          </p>
          
          <div className="pt-8">
            <Link to="/" className="text-primary font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
