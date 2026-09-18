import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Users, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Calendar, 
  Coins, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Plus,
  KeyRound,
  ExternalLink,
  Lock,
  Upload
} from 'lucide-react';
import { User, SavingsGroup, Transaction, TransactionType, ContributionReceipt } from '../types';
import { formatNaira } from '../data/initialData';

interface DashboardViewProps {
  user: User;
  groups: SavingsGroup[];
  transactions: Transaction[];
  receipts?: ContributionReceipt[];
  onOpenFundModal: () => void;
  onOpenWithdrawModal: () => void;
  onPayRound: (group: SavingsGroup) => void;
  onOpenUploadReceipt?: (group: SavingsGroup) => void;
  onViewGroupDetails: (group: SavingsGroup) => void;
  onViewReceipt: (transaction: Transaction) => void;
  onNavigateTab: (tab: 'explore' | 'create_group' | 'join_group') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  groups,
  transactions,
  receipts = [],
  onOpenFundModal,
  onOpenWithdrawModal,
  onPayRound,
  onOpenUploadReceipt,
  onViewGroupDetails,
  onViewReceipt,
  onNavigateTab,
}) => {
  // Filter for active groups
  const [groupFilter, setGroupFilter] = useState<'all' | 'admin' | 'member'>('all');
  
  // Filter for transactions
  const [txFilter, setTxFilter] = useState<'all' | TransactionType>('all');
  const [txSearch, setTxSearch] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Filter groups where user is either admin or member
  const userGroups = groups.filter((g) => {
    const isMember = g.members.some((m) => m.userId === user.id);
    const isAdmin = g.adminId === user.id;

    if (groupFilter === 'admin') return isAdmin;
    if (groupFilter === 'member') return isMember && !isAdmin;
    return isMember || isAdmin;
  });

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = txFilter === 'all' || tx.type === txFilter;
    const matchesSearch = tx.title.toLowerCase().includes(txSearch.toLowerCase()) ||
                          tx.reference.toLowerCase().includes(txSearch.toLowerCase()) ||
                          (tx.groupName && tx.groupName.toLowerCase().includes(txSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const copyVirtualAccount = () => {
    navigator.clipboard.writeText('9928374829');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const copyGroupUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Welcome & Verification Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Tier 3 KYC Verified
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">BVN Linked</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-xs text-slate-500">
            TrustPass Digital Ajo Portal • Member ID: <span className="font-mono text-slate-700 font-bold">TP-NG-{user.id.slice(-4)}</span>
          </p>
        </div>

        {/* Quick Launch Buttons for Allowed 3 Options */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('create_group')}
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ajo Group</span>
          </button>
          <button
            onClick={() => onNavigateTab('join_group')}
            className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Join via UID</span>
          </button>
        </div>
      </div>

      {/* WALLET BALANCE & ESCROW FINANCIAL CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Main Wallet Balance Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl border border-slate-800 shadow-lg flex flex-col justify-between space-y-4 md:col-span-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Available Wallet Balance
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>NIP Liquid</span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
              {formatNaira(user.walletBalance)}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
              <span>Dedicated Virtual Account:</span>
              <strong className="text-white font-mono">9928374829 (Wema Bank)</strong>
              <button 
                onClick={copyVirtualAccount}
                className="text-emerald-400 hover:text-emerald-300 p-1"
                title="Copy Account Number"
              >
                {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
            <button
              id="dashboard-fund-wallet-btn"
              onClick={onOpenFundModal}
              className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Fund Wallet</span>
            </button>
            <button
              id="dashboard-withdraw-btn"
              onClick={onOpenWithdrawModal}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw to Bank</span>
            </button>
          </div>
        </div>

        {/* Locked in Escrow Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Locked in Active Ajo</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-heading">
              {formatNaira(user.lockedEscrowBalance)}
            </div>
            <p className="text-[11px] text-slate-500">
              Safe in rotational trustee escrow pool until round disbursement.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Security Status</span>
            <span className="font-semibold text-emerald-700">100% Insured</span>
          </div>
        </div>

        {/* Payouts Received to Date Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Payouts Won</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 font-heading">
              {formatNaira(user.totalEarned)}
            </div>
            <p className="text-[11px] text-slate-500">
              Disbursed lump-sums from completed rotational rounds.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Next Payout Turn</span>
            <span className="font-semibold text-slate-900">Oct 15, 2026</span>
          </div>
        </div>

      </section>

      {/* ACTIVE AJO SAVINGS GROUPS SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Your Ajo Savings Circles
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Manage your circles, monitor whose turn is active, and fulfill your round contributions.
            </p>
          </div>

          {/* Group Filter Tabs (All / Admin / Member) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setGroupFilter('all')}
              className={`py-1.5 px-3 rounded-lg transition ${
                groupFilter === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              All Circles ({groups.length})
            </button>
            <button
              onClick={() => setGroupFilter('admin')}
              className={`py-1.5 px-3 rounded-lg transition ${
                groupFilter === 'admin' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Created by You (Admin)
            </button>
            <button
              onClick={() => setGroupFilter('member')}
              className={`py-1.5 px-3 rounded-lg transition ${
                groupFilter === 'member' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Joined as Member
            </button>
          </div>
        </div>

        {/* Group Cards Grid */}
        {userGroups.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No active groups found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't created or joined any circles in this category yet. Launch a new one or join with an invite UID!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('create_group')}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Create Group
              </button>
              <button
                onClick={() => onNavigateTab('join_group')}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Join via UID
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {userGroups.map((group) => {
              const isAdmin = group.adminId === user.id;
              const myMemberRecord = group.members.find((m) => m.userId === user.id);
              const isPaid = myMemberRecord?.hasPaidCurrentCycle;
              const isMyTurnNext = myMemberRecord?.slotNumber === group.currentRound;
              const userPendingReceipt = receipts.find(
                (r) => r.groupId === group.id && r.memberId === user.id && r.status === 'pending_verification'
              );
              const adminPendingReceiptsCount = isAdmin
                ? receipts.filter((r) => r.groupId === group.id && r.status === 'pending_verification').length
                : 0;

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Badge header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {group.uid}
                        </span>
                        <button
                          onClick={() => copyGroupUid(group.uid)}
                          className="text-slate-400 hover:text-emerald-700 p-0.5"
                          title="Copy UID"
                        >
                          {copiedUid === group.uid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {adminPendingReceiptsCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs animate-pulse">
                            {adminPendingReceiptsCount} Review{adminPendingReceiptsCount > 1 ? 's' : ''}
                          </span>
                        )}

                        {isAdmin ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Admin / Creator</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Member
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{group.name}</h3>
                      <span className="text-xs text-slate-400 block">{group.category}</span>
                    </div>

                    {/* Financial Specs */}
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contribution:</span>
                        <span className="font-bold text-slate-900">
                          {formatNaira(group.contributionAmount)} / {group.frequency.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Pot:</span>
                        <span className="font-bold text-emerald-700">{formatNaira(group.totalPotSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cycle Turn:</span>
                        <span className="font-semibold text-slate-800">Round {group.currentRound} of {group.totalRounds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Your Turn:</span>
                        <span className="font-semibold text-emerald-800">
                          {myMemberRecord ? `Slot #${myMemberRecord.slotNumber} (${myMemberRecord.payoutDate})` : 'Coordinator'}
                        </span>
                      </div>
                    </div>

                    {/* Payment status badge */}
                    <div className="pt-2">
                      {isPaid ? (
                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Round {group.currentRound} Paid</span>
                          </span>
                          <span className="text-[11px] text-emerald-600">Locked in Escrow</span>
                        </div>
                      ) : userPendingReceipt ? (
                        <div className="p-2 bg-amber-50 text-amber-900 rounded-xl flex items-center justify-between text-xs font-semibold border border-amber-200">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            <span>Receipt Submitted</span>
                          </span>
                          <span className="text-[11px] text-amber-700 font-bold">Admin Verifying</span>
                        </div>
                      ) : (
                        <div className="p-2 bg-amber-50 text-amber-800 rounded-xl flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Round {group.currentRound} Due</span>
                          </span>
                          <span className="text-xs font-bold text-amber-900">{formatNaira(group.contributionAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewGroupDetails(group)}
                      className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-1"
                    >
                      <span>{isAdmin ? (adminPendingReceiptsCount > 0 ? `Verify Receipts (${adminPendingReceiptsCount})` : 'Manage Circle') : 'View Schedule'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {!isPaid && !userPendingReceipt && onOpenUploadReceipt && (
                      <button
                        type="button"
                        onClick={() => onOpenUploadReceipt(group)}
                        title="Upload Transfer Receipt"
                        className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Slip</span>
                      </button>
                    )}

                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => onPayRound(group)}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap"
                      >
                        {userPendingReceipt ? 'View Payment' : 'Pay Due'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TRANSACTION HISTORY & SETTLEMENT PROCESSING FEATURES */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header with Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Transaction History & Settlement Processing
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Every deposit, contribution debit, and rotational payout is recorded with verifiable reference codes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Search by reference / circle..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTxFilter('all')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  txFilter === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTxFilter('payout')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  txFilter === 'payout' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Payouts
              </button>
              <button
                onClick={() => setTxFilter('contribution')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  txFilter === 'contribution' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Contributions
              </button>
              <button
                onClick={() => setTxFilter('deposit')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  txFilter === 'deposit' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setTxFilter('withdrawal')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  txFilter === 'withdrawal' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Withdrawals
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No transactions found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Description / Purpose</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Channel</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'deposit' || tx.type === 'payout';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition group">
                      <td className="py-3.5 font-mono font-bold text-slate-700">
                        {tx.reference}
                      </td>

                      <td className="py-3.5">
                        <span className="font-bold text-slate-900 block">{tx.title}</span>
                        <span className="text-[11px] text-slate-500">{tx.description}</span>
                      </td>

                      <td className="py-3.5 text-slate-500 whitespace-nowrap">
                        {tx.date}
                      </td>

                      <td className="py-3.5 text-slate-600">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          {tx.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 text-right font-extrabold whitespace-nowrap">
                        <span className={isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                          {isCredit ? '+' : '-'}{formatNaira(tx.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 text-center">
                        {tx.status === 'success' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Settled</span>
                          </span>
                        )}
                        {tx.status === 'escrow' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                            <Lock className="w-3 h-3" />
                            <span>In Escrow</span>
                          </span>
                        )}
                        {tx.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px] border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onViewReceipt(tx)}
                          className="py-1 px-2.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* QUICK EXPLORE BANNER (Leading to Explore/Learn More) */}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Education & Escrow Security
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading">
            New to Digital Ajo? Learn How Rotations are Guaranteed.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Read about automated disbursement schedules, trustee collateral protections, and how our interactive lump-sum simulator models your collective returns.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('explore')}
          className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap flex items-center gap-2"
        >
          <span>Explore / Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
