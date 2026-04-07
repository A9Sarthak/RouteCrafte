import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 md:p-14 border border-slate-100 dark:border-slate-700">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: April 2026</p>
        
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
          <p>
            Your privacy is critically important to us. At RouteCraft, we have a few fundamental principles:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We don’t ask you for personal information unless we truly need it.</li>
            <li>We don’t share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</li>
            <li>We don’t store personal information on our servers unless required for the on-going operation of one of our services.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3">Website Visitors</h3>
          <p>
            Like most website operators, RouteCraft collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request.
          </p>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3">Gathering of Personally-Identifying Information</h3>
          <p>
            Certain visitors to RouteCraft's websites choose to interact with RouteCraft in ways that require RouteCraft to gather personally-identifying information. The amount and type of information that RouteCraft gathers depends on the nature of the interaction. For example, we ask visitors who sign up for an account to provide a username and email address.
          </p>
          
          <div className="pt-8">
            <Link to="/" className="text-primary font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
