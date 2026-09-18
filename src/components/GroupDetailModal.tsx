import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Copy, 
  Check, 
  Calendar, 
  Coins, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Bell, 
  ArrowRight,
  Send,
  Share2,
  Sparkles,
  Lock,
  Building2,
  Upload,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';
import { SavingsGroup, User, ContributionReceipt } from '../types';
import { formatNaira } from '../data/initialData';
import { ViewReceiptPreviewModal } from './ViewReceiptPreviewModal';

interface GroupDetailModalProps {
  group: SavingsGroup | null;
  currentUser: User;
  receipts?: ContributionReceipt[];
  onClose: () => void;
  onPayRound: (group: SavingsGroup) => void;
  onOpenUploadReceipt?: (group: SavingsGroup) => void;
  onApproveReceipt?: (receiptId: string) => void;
  onRejectReceipt?: (receiptId: string, reason: string) => void;
  onDisburseRoundPayout?: (group: SavingsGroup, beneficiaryName: string, amount: number) => void;
  onNudgeMember?: (memberName: string) => void;
}

export const GroupDetailModal: React.FC<GroupDetailModalProps> = ({
  group,
  currentUser,
  receipts = [],
  onClose,
  onPayRound,
  onOpenUploadReceipt,
  onApproveReceipt,
  onRejectReceipt,
  onDisburseRoundPayout,
  onNudgeMember,
}) => {
  if (!group) return null;

  const isAdmin = group.adminId === currentUser.id;
  const currentMemberRecord = group.members.find((m) => m.userId === currentUser.id);
  const isMember = Boolean(currentMemberRecord);

  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [nudgedMembers, setNudgedMembers] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'schedule' | 'members' | 'admin' | 'receipts'>('schedule');
  const [selectedReceiptForPreview, setSelectedReceiptForPreview] = useState<ContributionReceipt | null>(null);

  const copyUid = () => {
    navigator.clipboard.writeText(group.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const copyPaystackAccount = () => {
    navigator.clipboard.writeText(group.paystackAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleNudge = (memId: string, memberName: string) => {
    setNudgedMembers((prev) => ({ ...prev, [memId]: true }));
    if (onNudgeMember) {
      onNudgeMember(memberName);
    }
  };

  // Group receipts
  const groupReceipts = receipts.filter((r) => r.groupId === group.id);
  const pendingReceipts = groupReceipts.filter((r) => r.status === 'pending_verification');
  const userPendingReceipt = groupReceipts.find(
    (r) => r.memberId === currentUser.id && r.roundNumber === group.currentRound && r.status === 'pending_verification'
  );

  // Check current cycle collection status
  const paidCount = group.members.filter((m) => m.hasPaidCurrentCycle).length;
  const totalDueCount = group.members.length;
  const currentPotCollected = paidCount * group.contributionAmount;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          
          {/* Header Banner */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {group.uid}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {group.category}
                </span>
                {isAdmin && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin / Creator</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {group.name}
              </h2>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                {group.description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-50 border-b border-slate-200 p-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Round Contribution</span>
              <span className="text-sm font-bold text-slate-900">{formatNaira(group.contributionAmount)}</span>
              <span className="text-[10px] text-slate-500 block">per {group.frequency.toLowerCase()}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Total Lump-Sum Pot</span>
              <span className="text-sm font-bold text-emerald-700">{formatNaira(group.totalPotSize)}</span>
              <span className="text-[10px] text-slate-500 block">per beneficiary</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Current Progress</span>
              <span className="text-sm font-bold text-slate-900">Round {group.currentRound} of {group.totalRounds}</span>
              <span className="text-[10px] text-emerald-600 block">Next Payout: {group.nextPayoutDate}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Custom Invite UID</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-mono font-bold text-slate-800 text-xs">{group.uid}</span>
                <button 
                  onClick={copyUid} 
                  className="text-emerald-700 hover:text-emerald-800"
                  title="Copy UID"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Paystack Collection Account Callout for All Members */}
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Admin Paystack Account for Member Payments:</span>
              </div>
              <p className="text-emerald-800">
                Bank: <strong className="text-slate-900">{group.paystackBankName}</strong> • Account: <strong className="font-mono text-slate-900">{group.paystackAccountNumber}</strong> • Name: <strong className="text-slate-900">{group.paystackAccountName}</strong>
              </p>
              <span className="text-[11px] text-emerald-700 block">
                Members can pay from ANY Nigerian bank (GTBank, Access, Zenith, Kuda, OPay, Palmpay, etc.).
              </span>
            </div>
            <button
              type="button"
              onClick={copyPaystackAccount}
              className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-xl flex items-center gap-1.5 shrink-0 transition"
            >
              {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{copiedAccount ? 'Copied' : 'Copy Paystack Details'}</span>
            </button>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex border-b border-slate-200 px-6 bg-white mt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition ${
                activeTab === 'schedule'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Rotational Schedule
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition ${
                activeTab === 'members'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Contributions ({paidCount}/{totalDueCount})
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'receipts'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Payment Receipts</span>
              {pendingReceipts.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                  {pendingReceipts.length}
                </span>
              )}
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 max-h-[55vh] overflow-y-auto">
            
            {/* TAB 1: ROTATIONAL PAYOUT SCHEDULE */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Cycle Rotational Order ({group.payoutRule})
                  </span>
                  <span className="text-slate-500">
                    Current Turn: <strong className="text-emerald-700">{group.currentBeneficiaryName}</strong>
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {group.members.map((member) => {
                    const isCurrentTurn = member.slotNumber === group.currentRound;
                    const hasAlreadyReceived = member.hasReceivedPayout;
                    const isSelf = member.userId === currentUser.id;

                    return (
                      <div 
                        key={member.id}
                        className={`p-3.5 flex items-center justify-between text-xs transition ${
                          isCurrentTurn 
                            ? 'bg-emerald-50/80 font-medium' 
                            : hasAlreadyReceived 
                            ? 'bg-slate-50/60' 
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isCurrentTurn
                              ? 'bg-emerald-600 text-white'
                              : hasAlreadyReceived
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}>
                            #{member.slotNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{member.fullName}</span>
                              {isSelf && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block">
                              Payout Scheduled: {member.payoutDate}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          {isCurrentTurn ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
                              <Sparkles className="w-3 h-3" />
                              <span>Active Turn ({formatNaira(group.totalPotSize)})</span>
                            </span>
                          ) : hasAlreadyReceived ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Payout Received</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Upcoming Round</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CURRENT ROUND MEMBER CONTRIBUTIONS */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-950 text-sm block">Round {group.currentRound} Escrow Pool</span>
                    <span className="text-emerald-800">
                      Collected {formatNaira(currentPotCollected)} of {formatNaira(group.totalPotSize)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-900 block">{paidCount}/{totalDueCount} Members Paid</span>
                    <span className="text-[10px] text-emerald-700">Protected in Paystack / Trustee Escrow</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {group.members.map((member) => {
                    const memberReceipt = groupReceipts.find(
                      (r) => r.memberId === member.userId && r.roundNumber === group.currentRound
                    );

                    return (
                      <div key={member.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center">
                            {member.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{member.fullName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{member.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {member.hasPaidCurrentCycle ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Paid ({formatNaira(group.contributionAmount)})</span>
                            </span>
                          ) : memberReceipt?.status === 'pending_verification' ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold rounded-full border border-amber-200 text-xs">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Receipt Uploaded (Verifying)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedReceiptForPreview(memberReceipt)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Slip</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded-full border border-slate-200 text-xs">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Payment Due</span>
                              </span>

                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleNudge(member.id, member.fullName)}
                                  disabled={nudgedMembers[member.id]}
                                  className="px-2 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition"
                                >
                                  <Bell className="w-3 h-3" />
                                  <span>{nudgedMembers[member.id] ? 'Nudged' : 'Send Reminder'}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: PAYMENT RECEIPTS (MEMBER UPLOADS & ADMIN VERIFICATION) */}
            {activeTab === 'receipts' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                      Payment Receipts & Proofs
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Receipts uploaded by members after paying into the Admin Paystack account.
                    </p>
                  </div>
                  
                  {isMember && !currentMemberRecord?.hasPaidCurrentCycle && onOpenUploadReceipt && (
                    <button
                      type="button"
                      onClick={() => onOpenUploadReceipt(group)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload My Receipt</span>
                    </button>
                  )}
                </div>

                {groupReceipts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-slate-400" />
                    <span className="font-bold text-slate-700 block">No Receipts Uploaded Yet</span>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      When members make a bank transfer to the Admin's Paystack account, they can upload their transfer receipt here for immediate admin verification.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {groupReceipts.map((rcpt) => (
                      <div key={rcpt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/60 transition">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{rcpt.memberName}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="font-bold text-emerald-700">{formatNaira(rcpt.amount)}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                              Round {rcpt.roundNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            From: <strong>{rcpt.senderBankName}</strong> ({rcpt.senderAccountName})
                          </p>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Uploaded: {rcpt.uploadedAt} • {rcpt.receiptFileName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {rcpt.status === 'verified' && (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          )}

                          {rcpt.status === 'pending_verification' && (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-full border border-amber-200 text-[11px] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending Review</span>
                            </span>
                          )}

                          {rcpt.status === 'rejected' && (
                            <span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-full border border-red-200 text-[11px] flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Rejected</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedReceiptForPreview(rcpt)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isAdmin ? 'Verify Slip' : 'View Slip'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ADMIN MANAGEMENT CONSOLE */}
            {activeTab === 'admin' && isAdmin && (
              <div className="space-y-4">
                
                {/* Pending Verification Banner for Admin */}
                {pendingReceipts.length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-800" />
                        <span className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                          {pendingReceipts.length} Member Payment Receipts Pending Verification
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('receipts')}
                        className="text-xs font-bold text-amber-900 hover:underline"
                      >
                        Review Receipts →
                      </button>
                    </div>
                    <p className="text-xs text-amber-800">
                      Members have submitted proof of bank transfer into your Paystack account. Verify to credit their slot for Round {group.currentRound}.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
                      Admin Payout Disbursement Controls
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    As Admin, once members contribute for Round {group.currentRound} and their receipts are verified, you can disburse the pool to <strong>{group.currentBeneficiaryName}</strong>.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onDisburseRoundPayout) {
                          onDisburseRoundPayout(group, group.currentBeneficiaryName, group.totalPotSize);
                        }
                        alert(`Round ${group.currentRound} pot of ${formatNaira(group.totalPotSize)} disbursed to ${group.currentBeneficiaryName}!`);
                      }}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                    >
                      <Coins className="w-4 h-4" />
                      <span>Disburse Round {group.currentRound} Pot ({formatNaira(group.totalPotSize)})</span>
                    </button>
                  </div>
                </div>

                {/* Admin Paystack Setup Summary */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 uppercase tracking-wider block">
                      Admin Paystack Collection Details
                    </span>
                    <span className="text-emerald-700 font-bold">Active & Configured</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                    <div>
                      <span className="block text-slate-400">Paystack NUBAN:</span>
                      <span className="font-mono font-bold text-slate-900">{group.paystackAccountNumber}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Partner Bank:</span>
                      <span className="font-semibold text-slate-800">{group.paystackBankName}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Account Name:</span>
                      <span className="font-semibold text-slate-800">{group.paystackAccountName}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Payment Acceptance:</span>
                      <span className="font-semibold text-emerald-700">Any Nigerian Bank Account</span>
                    </div>
                  </div>
                </div>

                {/* Invite Share Action */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                    Invite Members via Custom UID
                  </span>
                  <p className="text-slate-300">
                    Share this custom UID with members you wish to onboard into your circle:
                  </p>
                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400 text-sm tracking-wider">{group.uid}</span>
                    <button
                      type="button"
                      onClick={copyUid}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
                    >
                      {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUid ? 'Copied' : 'Copy UID'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {isMember ? (
                <span>
                  Your Turn: <strong className="text-slate-900">Slot #{currentMemberRecord?.slotNumber} ({currentMemberRecord?.payoutDate})</strong>
                  {userPendingReceipt && (
                    <span className="ml-2 text-amber-700 font-semibold">• Receipt Pending Verification</span>
                  )}
                </span>
              ) : (
                <span>You are viewing this circle as guest.</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-white transition"
              >
                Close
              </button>

              {isMember && !currentMemberRecord?.hasPaidCurrentCycle && onOpenUploadReceipt && (
                <button
                  type="button"
                  id="upload-receipt-modal-btn"
                  onClick={() => {
                    onClose();
                    onOpenUploadReceipt(group);
                  }}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Paystack Receipt</span>
                </button>
              )}

              {isMember && !currentMemberRecord?.hasPaidCurrentCycle && (
                <button
                  type="button"
                  id="pay-round-btn"
                  onClick={() => {
                    onClose();
                    onPayRound(group);
                  }}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Coins className="w-4 h-4" />
                  <span>Pay with Wallet ({formatNaira(group.contributionAmount)})</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* View/Review Receipt Modal */}
      {selectedReceiptForPreview && (
        <ViewReceiptPreviewModal
          receipt={selectedReceiptForPreview}
          group={group}
          isAdmin={isAdmin}
          onClose={() => setSelectedReceiptForPreview(null)}
          onApproveReceipt={(rcptId) => {
            if (onApproveReceipt) onApproveReceipt(rcptId);
            setSelectedReceiptForPreview(null);
          }}
          onRejectReceipt={(rcptId, reason) => {
            if (onRejectReceipt) onRejectReceipt(rcptId, reason);
            setSelectedReceiptForPreview(null);
          }}
        />
      )}
    </>
  );
};

