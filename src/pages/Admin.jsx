import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/admin/stats", { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empId, password }),
        credentials: "include"
      });
      if (res.ok) {
        setIsLoggedIn(true);
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex justify-center items-center text-slate-500 dark:text-slate-400 font-bold">Loading Admin...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] p-4">
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
          <div className="flex justify-center mb-4">
            <span className="material-icons text-5xl text-primary">admin_panel_settings</span>
          </div>
          <h2 className="text-2xl font-black mb-6 text-slate-800 dark:text-white text-center">Admin Portal</h2>
          {error && <div className="text-red-600 dark:text-red-400 mb-4 text-center bg-red-50 dark:bg-red-900/30 p-3 rounded-xl text-sm border border-red-200 dark:border-red-800">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Employee ID</label>
              <input type="text" value={empId} onChange={(e) => setEmpId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white" placeholder="Enter Emp ID" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-sky-500 transition-colors">Log In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="material-icons text-3xl text-primary">admin_panel_settings</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Admin Dashboard</h1>
          </div>
          <button onClick={() => {
             fetch("http://localhost:4000/api/auth/logout", { method: "POST", credentials: "include" })
               .then(() => setIsLoggedIn(false));
          }} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-lg">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div>
               <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">Total Registered Users</h2>
               <p className="text-6xl font-black text-slate-800 dark:text-white">{stats?.userCount || 0}</p>
             </div>
             <span className="material-icons text-7xl text-slate-200 dark:text-slate-700">people</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div>
               <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">Total Messages</h2>
               <p className="text-6xl font-black text-primary">{stats?.contacts?.length || 0}</p>
             </div>
             <span className="material-icons text-7xl text-sky-100 dark:text-sky-900/30 text-primary">mail</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
           <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Messages from Users</h2>
           {(!stats?.contacts || stats.contacts.length === 0) ? (
             <div className="text-center py-12">
               <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4 block">inbox</span>
               <p className="text-slate-500 dark:text-slate-400 font-medium">No messages yet.</p>
             </div>
           ) : (
             <div className="divide-y divide-slate-100 dark:divide-slate-700">
               {stats.contacts.map((contact, i) => (
                 <div key={i} className="py-6 first:pt-2 last:pb-2">
                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                     <div>
                       <h3 className="font-bold text-lg text-slate-800 dark:text-white">{contact.name}</h3>
                       <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline font-medium">{contact.email}</a>
                     </div>
                     <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full whitespace-nowrap">
                       {new Date(contact.createdAt).toLocaleString()}
                     </span>
                   </div>
                   <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl mt-3">{contact.message}</p>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
