import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-14 border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white"><span className="material-icons-round text-2xl">map</span></div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">About RouteCraft</h1>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
          <p className="text-xl font-medium text-slate-800 dark:text-white leading-relaxed">
            Welcome to RouteCraft, your ultimate visual travel companion. Founded by passionate explorers, our mission is to make planning trips as enjoyable as the journey itself.
          </p>
          <p>
            We realized that travelers were juggling too many tools—spreadsheets, map apps, scattered notes, and group chats—just to organize a simple vacation. We built RouteCraft to bring everything into one master interface.
          </p>
          <p>
            Whether you are organizing a weekend getaway, a massive road trip, or a multi-country expedition, RouteCraft helps you visualize destinations, log budgets, pinpoint real-world landmarks, and share memories without the headache.
          </p>
          <div className="pt-8">
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <span className="material-icons-outlined">arrow_back</span>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
