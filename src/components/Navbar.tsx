import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  LogOut, 
  Bell, 
  User as UserIcon, 
  Plus, 
  ArrowDownRight, 
  Copy, 
  Check,
  Building2,
  ExternalLink
} from 'lucide-react';
import { User } from '../types';
import { formatNaira } from '../data/initialData';

interface NavbarProps {
  user: User;
  onSignOut: () => void;
  onOpenFundModal: () => void;
  onOpenWithdrawModal: () => void;
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'explore' | 'create_group' | 'join_group') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSignOut,
  onOpenFundModal,
  onOpenWithdrawModal,
  activeTab,
  setActiveTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Ajo Round 4 Contribution Due',
      desc: 'Mainland Rent Savers 2026 payout turn is preparing.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Escrow Settlement Cleared',
      desc: '₦150,000 wallet top-up verified via Wema virtual account.',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Member Joined Circle',
      desc: 'Madam Grace Aliu accepted invite to Lekki Tech Founders Circle.',
      time: '2 days ago',
      unread: false,
    }
  ];

  const copyVirtualAccount = () => {
    navigator.clipboard.writeText('9928374829');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-lg">
      {/* Top Banner / Verification status */}
      <div className="bg-emerald-950/60 border-b border-emerald-800/40 px-4 sm:px-6 py-1 text-emerald-300 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>TrustPass Digital Ajo Escrow: Verified Nigerian Banking Partner (CBN Framework Aligned)</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span>Dedicated Virtual Account: <strong className="text-white font-mono">9928374829 (Wema)</strong></span>
          <button 
            onClick={copyVirtualAccount}
            className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-semibold"
          >
            {copiedAccount ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/50 group-hover:scale-105 transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-heading">
                TrustPass
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                AJO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block">Digital Thrift & Rotational Savings</span>
          </div>
        </div>

        {/* Center: Navigation Options (Dashboard + Only 3 Options) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            id="nav-dashboard-btn"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Dashboard
          </button>
          <button
            id="nav-explore-btn"
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'explore'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Explore / Learn More
          </button>
          <button
            id="nav-create-group-btn"
            onClick={() => setActiveTab('create_group')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'create_group'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a Savings Group</span>
          </button>
          <button
            id="nav-join-group-btn"
            onClick={() => setActiveTab('join_group')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'join_group'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Join a Savings Group
          </button>
        </nav>

        {/* Right Section: Quick Wallet Pill & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Wallet Balance Pill */}
          <div className="hidden sm:flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 gap-2.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold leading-none">Wallet</span>
              <span className="text-xs font-bold text-emerald-400 leading-tight">
                {formatNaira(user.walletBalance)}
              </span>
            </div>
            <button
              onClick={onOpenFundModal}
              className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1 transition"
              title="Fund Wallet"
            >
              <ArrowDownRight className="w-3 h-3" />
              <span>Fund</span>
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Ajo Notifications</span>
                  <span className="text-[10px] text-emerald-400 font-medium">1 new</span>
                </div>
                <div className="divide-y divide-slate-800 mt-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                {user.fullName.slice(0, 2)}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-white leading-none truncate max-w-[100px]">
                  {user.fullName}
                </span>
                <span className="block text-[10px] text-emerald-400 font-medium leading-tight">
                  Verified Member
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs animate-fade-in">
                <div className="pb-3 border-b border-slate-800 space-y-1">
                  <div className="font-bold text-sm text-white">{user.fullName}</div>
                  <div className="text-slate-400 text-[11px] truncate">{user.email}</div>
                  <div className="text-emerald-400 text-[11px] font-mono">BVN: •••• •••• {user.bvn.slice(-4)}</div>
                </div>

                <div className="py-2 space-y-1 border-b border-slate-800">
                  <button
                    onClick={() => { setShowProfileMenu(false); onOpenFundModal(); }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>Fund Wallet</span>
                    <span className="text-emerald-400 font-semibold">+</span>
                  </button>
                  <button
                    onClick={() => { setShowProfileMenu(false); onOpenWithdrawModal(); }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>Withdraw Funds</span>
                    <span className="text-slate-400">Bank</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    id="sign-out-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    className="w-full py-2 px-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 font-semibold text-left flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-Bar (Dashboard + Only 3 Options) */}
      <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-2 flex items-center justify-around overflow-x-auto text-[11px] font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'explore' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Explore/Learn More
        </button>
        <button
          onClick={() => setActiveTab('create_group')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'create_group' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Create Group
        </button>
        <button
          onClick={() => setActiveTab('join_group')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'join_group' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Join Group
        </button>
      </div>
    </header>
  );
};
