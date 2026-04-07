import { useMemo, useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadAvatar, updateProfile } from "../services/api";

export default function ProfileSettings() {
  const { user, refresh } = useAuth();

  const profile = useMemo(() => user?.profile || {}, [user]);
  const memberSince = useMemo(
    () => (user?.createdAt ? new Date(user.createdAt).getFullYear() : null),
    [user]
  );
  const displayName = user?.name || user?.email || "User";
  const avatar = profile?.avatar || "/images/default-avatar.png";
  const preferredCurrency = profile?.preferences?.currency || "USD";

  const [form, setForm] = useState({ fullName: displayName, email: user?.email || "", currency: preferredCurrency, newPassword: "" });
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const fileInputRef = useRef(null);
  
  useEffect(() => {
    setAvatarPreview(avatar);
  }, [avatar]);

  // Sync form with user context whenever it opens
  useEffect(() => {
    if (isModalOpen) {
      setForm({ fullName: displayName, email: user?.email || "", currency: preferredCurrency, newPassword: "" });
      setShowPasswordChange(false);
      setErrorMsg("");
    }
  }, [isModalOpen, displayName, preferredCurrency, user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setAvatarPreview(URL.createObjectURL(file));
    setMsg(""); setErrorMsg("");
    
    try {
      await uploadAvatar(file);
      await refresh();
      setMsg("Profile picture uploaded successfully!");
    } catch (err) {
      setErrorMsg(err.message || "Failed to upload profile picture");
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrorMsg("");
    
    if (form.fullName.trim().length < 2) {
      setErrorMsg("Full Name must be at least 2 characters.");
      return;
    }

    if (showPasswordChange && form.newPassword && form.newPassword.length < 6) {
      setErrorMsg("New Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    let payload = { fullName: form.fullName, currency: form.currency };
    if (showPasswordChange && form.newPassword) {
       payload.newPassword = form.newPassword;
    }

    try {
      await updateProfile(payload);
      await refresh();
      setMsg("Profile settings updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex antialiased selection:bg-primary/30 selection:text-primary">
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full relative">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Account Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your profile, preferences and travel history.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 lg:col-start-3 space-y-6">
            
            {msg && <div className="mb-6 text-sm font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-200 dark:border-green-800/50 flex items-center gap-2 shadow-sm"><span className="material-icons text-lg">check_circle</span>{msg}</div>}
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 dark:opacity-10 z-0 pointer-events-none"></div>
              <div className="relative mb-6 z-10 mt-4">
                <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-primary to-blue-300 shadow-lg">
                  <img
                    alt={displayName}
                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-800"
                    src={avatarPreview}
                  />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  aria-label="Change photo"
                  className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full hover:bg-sky-500 transition-colors shadow-md border-2 border-white dark:border-slate-800"
                >
                  <span className="material-icons text-[18px] block mt-px">
                    photo_camera
                  </span>
                </button>
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white z-10 relative">
                {displayName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium z-10 relative">
                {user?.email || "Member"}{" "}
                {memberSince ? <span className="inline-block"><span className="mx-2">•</span>Member since {memberSince}</span> : ""}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3 m-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                    <span className="material-icons text-[20px]">person</span>
                  </div>
                  Personal Details
                </h3>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold text-sm"
                >
                  <span className="material-icons text-[18px]">edit</span>
                  Edit Profile
                </button>
              </div>
              
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Full Name</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{displayName}</p>
                 </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{user?.email || ""}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Preferred Currency</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{preferredCurrency} ({preferredCurrency === 'USD' ? '$' : preferredCurrency === 'EUR' ? '€' : preferredCurrency === 'GBP' ? '£' : preferredCurrency === 'JPY' ? '¥' : '₹'})</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">••••••••</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="material-icons-round text-primary">edit_note</span> Edit Profile
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {errorMsg && <div className="mb-6 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-800/50 flex items-center gap-2"><span className="material-icons text-lg">error</span>{errorMsg}</div>}

                <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="fullName">Full Name</label>
                    <div className="relative">
                      <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">badge</span>
                      <input
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        id="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        minLength="2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">Email Address</label>
                    <div className="relative">
                      <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                      <input
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 font-medium cursor-not-allowed outline-none"
                        id="email"
                        type="email"
                        value={form.email}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="currency">Preferred Currency</label>
                    <div className="relative">
                      <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">payments</span>
                      <select
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                        id="currency"
                        value={form.currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                      <span className="material-icons-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                    
                    {!showPasswordChange ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                          <input
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed outline-none tracking-[0.2em] font-medium"
                            type="password"
                            value="********"
                            disabled
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPasswordChange(true)}
                          className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
                        >
                          Change Password
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-primary/20">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-primary">New Password</span>
                          <button 
                            type="button"
                            onClick={() => {
                              setShowPasswordChange(false);
                              setForm(prev => ({...prev, newPassword: ""}));
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          >
                            Cancel Change
                          </button>
                        </div>
                        <div className="relative">
                          <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg">key</span>
                          <input
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary/30 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password (min 6 chars)"
                            value={form.newPassword}
                            onChange={handleChange}
                            minLength="6"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-6 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="editProfileForm"
                  className="py-3 px-8 rounded-xl bg-primary text-white font-bold hover:bg-sky-500 shadow-lg shadow-sky-500/30 transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="material-icons animate-spin text-[18px]">refresh</span> Saving...</>
                  ) : (
                    <><span className="material-icons text-[18px]">save</span> Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
