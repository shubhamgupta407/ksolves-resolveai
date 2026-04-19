import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  Bell, 
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Globe,
  Database,
  Key,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleShowcaseAction = (actionName) => {
    showToast(`${actionName} successfully`, 'success');
  };

  return (
    <div className="animate-fade-in relative">
      {/* Feedback Toast */}
      {toast && (
        <div className="fixed top-24 right-8 z-[100] animate-fade-in">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-slate-900 border-slate-700 text-white' : 
            toast.type === 'info' ? 'bg-slate-900/90 border-slate-700 text-white' : 
            'bg-amber-500/90 border-amber-400 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} />}
            <p className="text-sm font-bold tracking-tight">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Workspace Settings</h1>
        <p className="page-subtitle">Manage your personal profile, security, and workspace preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 border-b lg:border-b-0 border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 max-w-4xl">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User size={20} className="text-primary-500" /> Public Profile
                </h3>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative group cursor-pointer" onClick={() => handleShowcaseAction('Avatar updated')}>
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-indigo-100 border-2 border-white shadow-md flex items-center justify-center text-primary-700 text-2xl font-bold ring-4 ring-slate-50 overflow-hidden relative">
                      KS
                      <div className="absolute inset-0 bg-slate-900/40 font-bold text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        Change
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary-100/50 outline-none transition-all" defaultValue="Shubham Gupta" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary-100/50 outline-none transition-all" defaultValue="aarushjais407@gmail.com" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary-100/50 outline-none transition-all" defaultValue="Senior Backend Engineer / Architect" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                   <button 
                     onClick={() => handleShowcaseAction('Profile saved')}
                     className="btn btn-primary px-6"
                   >
                     Save Profile
                   </button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Globe size={20} className="text-emerald-500" /> Language & Regional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interface Language</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:bg-white outline-none">
                         <option>English (US)</option>
                         <option>Hindi (IN)</option>
                         <option>French (FR)</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timezone</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:bg-white outline-none">
                         <option>India Standard Time (IST)</option>
                         <option>Pacific Time (PT)</option>
                         <option>Eastern Time (ET)</option>
                      </select>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Lock size={20} className="text-amber-500" /> Authentication
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                         <div className="text-sm font-bold text-slate-900">Change Password</div>
                         <div className="text-xs text-slate-500">Last changed 4 months ago</div>
                      </div>
                      <button 
                        onClick={() => handleShowcaseAction('Password rotation initiated')}
                        className="btn btn-secondary text-xs"
                      >
                        Update
                      </button>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                         <div className="text-sm font-bold text-slate-900">Two-Factor Authentication</div>
                         <div className="text-xs text-slate-500">Add an extra layer of security to your account</div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer" onClick={() => handleShowcaseAction('Security settings updated')}>
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="card">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                     <Key size={20} className="text-primary-500" /> API Credentials
                   </h3>
                   <button 
                     onClick={() => handleShowcaseAction('API Key generated')}
                     className="btn btn-primary px-4 py-1.5 text-xs"
                   >
                     Generate New
                   </button>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-inner group">
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PROD_KEY_RESOLVE_AI</span>
                         <code className="text-xs text-primary-300 font-mono">
                            {showPassword ? 'rk_v2_f8d4e9j2k8m5n3p1' : '••••••••••••••••••••'}
                         </code>
                      </div>
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
               <div className="card">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Database size={20} className="text-indigo-500" /> Workspace Settings
                  </h3>
                  <div className="space-y-5">
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace Name</label>
                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:bg-white outline-none" defaultValue="ResolveAI Team Workspace" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Automation Strictness</label>
                        <div className="flex items-center gap-4">
                           <input type="range" className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" defaultValue="85" />
                           <span className="text-sm font-bold text-primary-600 font-mono">85%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium italic mt-2">Minimum confidence threshold before an agent attempts autonomous resolution.</p>
                     </div>
                  </div>
               </div>

               <div className="card p-0 overflow-hidden border-red-100 bg-red-50/20">
                  <div className="p-6">
                     <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                     <p className="text-sm text-slate-500 mb-6">Irreversible actions regarding your workspace data and access logs.</p>
                     <div className="flex flex-col md:flex-row gap-4">
                        <button 
                          onClick={() => handleShowcaseAction('Automation paused')}
                          className="btn bg-white text-red-600 border-red-200 hover:bg-red-50 flex-1"
                        >
                          Pause Automation
                        </button>
                        <button 
                          onClick={() => handleShowcaseAction('Workspace deleted')}
                          className="btn bg-red-600 text-white hover:bg-red-700 flex-1"
                        >
                          Delete Workspace
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'notifications' && (
             <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <Bell size={20} className="text-primary-500" /> Notification Channels
                </h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                            <Mail size={20} />
                         </div>
                         <div>
                            <div className="text-sm font-bold text-slate-900">Email Updates</div>
                            <div className="text-xs text-slate-500">Weekly automation health reports</div>
                         </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer" onClick={() => handleShowcaseAction('Preferences updated')}>
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-primary-50/50 rounded-2xl border border-primary-100 border-dashed">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <div className="w-5 h-5 bg-[#4A154B] rounded-md"></div>
                         </div>
                         <div>
                            <div className="text-sm font-bold text-slate-900">Slack Integration</div>
                            <div className="text-xs text-primary-600 font-bold uppercase tracking-widest">Recommended</div>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleShowcaseAction('Integration initiated')}
                        className="btn btn-primary px-4 py-1.5 text-xs"
                      >
                        Connect
                      </button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'billing' && (
             <div className="card bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <CreditCard size={120} />
                </div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-10">
                      <div>
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Plan</div>
                         <h4 className="text-2xl font-black text-white tracking-tight">Enterprise Pro <span className="text-primary-400 text-sm ml-2">Early Access</span></h4>
                      </div>
                      <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/30 uppercase tracking-widest">Active</div>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                      <div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Seats</div>
                         <div className="text-lg font-bold">Unlimited</div>
                      </div>
                      <div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacity</div>
                         <div className="text-lg font-bold">120K / 500K <span className="text-xs text-slate-500">tickets</span></div>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Renewal</div>
                         <div className="text-lg font-bold">April 24, 2026</div>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => handleShowcaseAction('Subscription portal opened')}
                     className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors"
                   >
                      Manage Subscription
                   </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
