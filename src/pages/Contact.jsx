import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.error || "Failed to send message");
      }
      
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-14 border border-slate-100 dark:border-slate-700">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Get in Touch</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Have questions, feedback, or need support? Drop us a line below.</p>
        
        {sent ? (
           <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-6 rounded-xl text-center">
             <span className="material-icons text-5xl mb-3 block">check_circle</span>
             <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
             <p>Thanks for reaching out. We will get back to you shortly.</p>
             <button onClick={() => setSent(false)} className="mt-4 text-sm font-bold underline">Send another</button>
           </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input required type="text" name="name" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input required type="email" name="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white" placeholder="hello@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea required rows="5" name="message" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-sky-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
        
        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-700 text-center">
            <Link to="/" className="text-primary hover:text-sky-500 font-bold transition">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
