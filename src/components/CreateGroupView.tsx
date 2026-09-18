import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Calendar, 
  Coins, 
  Share2, 
  Lock, 
  Settings,
  HelpCircle,
  AlertCircle,
  Building2,
  ExternalLink,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { User, SavingsGroup, ContributionFrequency, PayoutRule } from '../types';
import { formatNaira, generateCustomGroupUid } from '../data/initialData';

interface CreateGroupViewProps {
  currentUser: User;
  onGroupCreated: (newGroup: SavingsGroup) => void;
  onViewCreatedGroup: (groupId: string) => void;
}

export const CreateGroupView: React.FC<CreateGroupViewProps> = ({
  currentUser,
  onGroupCreated,
  onViewCreatedGroup,
}) => {
  // Form fields
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Business' | 'Rent & Housing' | 'Personal Savings' | 'Tech & Equipment' | 'Emergency Thrift'>('Personal Savings');
  const [contributionAmount, setContributionAmount] = useState<number>(25000);
  const [frequency, setFrequency] = useState<ContributionFrequency>('Monthly');
  const [maxMembers, setMaxMembers] = useState<number>(10);
  const [payoutRule, setPayoutRule] = useState<PayoutRule>('First-come sequence');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [adminParticipates, setAdminParticipates] = useState<boolean>(true);
  const [adminSlot, setAdminSlot] = useState<number>(1);
  const [lateFee, setLateFee] = useState<number>(2000);

  // Paystack Collection Account (Mandatory for Admin)
  const [paystackAccountNumber, setPaystackAccountNumber] = useState('9920194821');
  const [paystackAccountName, setPaystackAccountName] = useState(`${currentUser.fullName} - Ajo Circle Escrow`);
  const [paystackBankName, setPaystackBankName] = useState('Titan Trust Bank (Paystack-Titan)');
  const [showPaystackReferralModal, setShowPaystackReferralModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Live UID Preview
  const [customUid, setCustomUid] = useState<string>(() => generateCustomGroupUid('AJO'));

  // Success Modal
  const [createdGroup, setCreatedGroup] = useState<SavingsGroup | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Regenerate UID
  const handleRegenerateUid = () => {
    setCustomUid(generateCustomGroupUid(groupName || 'AJO'));
  };

  const totalPot = contributionAmount * maxMembers;

  const handleReferToPaystack = () => {
    window.open('https://dashboard.paystack.com/#/signup', '_blank', 'noopener,noreferrer');
    setShowPaystackReferralModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!groupName.trim()) {
      setValidationError('Please enter a name for your savings circle.');
      return;
    }

    if (!paystackAccountNumber.trim() || paystackAccountNumber.trim().length < 10) {
      setValidationError('Each Admin must input a valid 10-digit Paystack Account Number where members will make payment.');
      return;
    }

    if (!paystackAccountName.trim()) {
      setValidationError('Please enter your Paystack Account Name as registered on your Paystack profile.');
      return;
    }

    const newGroupId = `grp_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const newGroup: SavingsGroup = {
      id: newGroupId,
      uid: customUid,
      name: groupName.trim(),
      description: description.trim() || 'A structured digital Ajo savings circle with automated escrow.',
      category,
      contributionAmount,
      frequency,
      maxMembers,
      currentMembersCount: adminParticipates ? 1 : 0,
      totalPotSize: totalPot,
      adminId: currentUser.id,
      adminName: currentUser.fullName,
      adminEmail: currentUser.email,
      paystackAccountNumber: paystackAccountNumber.trim(),
      paystackAccountName: paystackAccountName.trim(),
      paystackBankName,
      payoutRule,
      isPrivate,
      status: 'recruiting',
      startDate: today,
      currentRound: 1,
      totalRounds: maxMembers,
      nextPayoutDate: '2026-10-01',
      currentBeneficiaryId: adminParticipates && adminSlot === 1 ? currentUser.id : 'Pending round start',
      currentBeneficiaryName: adminParticipates && adminSlot === 1 ? `${currentUser.fullName} (Admin)` : 'Pending member join',
      allowAdminParticipation: adminParticipates,
      lateFee,
      members: adminParticipates
        ? [
            {
              id: `mem_adm_${Date.now()}`,
              userId: currentUser.id,
              fullName: `${currentUser.fullName} (Admin)`,
              email: currentUser.email,
              phone: currentUser.phone,
              slotNumber: adminSlot,
              hasPaidCurrentCycle: false,
              hasReceivedPayout: false,
              payoutDate: '2026-10-01',
              isCurrentUser: true,
              receiptStatus: 'none',
            }
          ]
        : [],
    };

    onGroupCreated(newGroup);
    setCreatedGroup(newGroup);
  };

  const copyUid = () => {
    if (createdGroup) {
      navigator.clipboard.writeText(createdGroup.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const copyInviteLink = () => {
    if (createdGroup) {
      const link = `https://trustpass.ng/join?uid=${createdGroup.uid}`;
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Creator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Create a New Savings Group (Ajo Circle)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            As the creator, you will act as the <strong className="text-slate-900">Admin</strong> managing member approvals, Paystack payment verification, and rotational schedules.
          </p>
        </div>
      </div>

      {/* Main form & Live Preview grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Creation Form */}
        <form onSubmit={handleCreateSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Group Name & Category */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Circle / Group Name
              </label>
              <input
                type="text"
                id="create-group-name-input"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (e.target.value.length > 2) {
                    setCustomUid(generateCustomGroupUid(e.target.value));
                  }
                }}
                placeholder="e.g. Lagos Tech Founders Circle 2026"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Savings Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Personal Savings">Personal Savings & Investment</option>
                <option value="Business">Business Capital & Working Inventory</option>
                <option value="Rent & Housing">Rent & Housing Annual Renewal</option>
                <option value="Tech & Equipment">Tech Gadgets & Equipment</option>
                <option value="Emergency Thrift">Emergency & Festive Thrift</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Circle Rules
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly state the goal of this Ajo group, payment deadlines, and member expectations..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* MANDATORY PAYSTACK ACCOUNT CONFIGURATION FOR ADMIN */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Admin Paystack Collection Account (Mandatory)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Members will make their rotational contribution transfers into this Paystack account from ANY Nigerian bank.
                </p>
              </div>

              {/* Referral button for admins without a Paystack account */}
              <button
                type="button"
                id="refer-paystack-btn"
                onClick={handleReferToPaystack}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                <span>Create Paystack Account</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Paystack Account Number (10 Digits) *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    id="admin-paystack-account-input"
                    value={paystackAccountNumber}
                    onChange={(e) => setPaystackAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9920194821"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Your 10-digit dedicated Paystack NUBAN</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Paystack Partner Bank
                  </label>
                  <select
                    value={paystackBankName}
                    onChange={(e) => setPaystackBankName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Titan Trust Bank (Paystack-Titan)">Titan Trust Bank (Paystack-Titan)</option>
                    <option value="Wema Bank (Paystack Dedicated)">Wema Bank (Paystack Dedicated)</option>
                    <option value="Providus Bank (Paystack Dedicated)">Providus Bank (Paystack Dedicated)</option>
                  </select>
                  <span className="text-[11px] text-slate-500 mt-1 block">Partner bank backing your Paystack account</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Paystack Account Name *
                </label>
                <input
                  type="text"
                  id="admin-paystack-name-input"
                  value={paystackAccountName}
                  onChange={(e) => setPaystackAccountName(e.target.value)}
                  placeholder="e.g. Tunde Adebayo / Lekki Founders Ajo"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">The legal or registered business name on your Paystack account</span>
              </div>

              <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Members can transfer to this account using GTBank, Zenith, Access, Kuda, OPay, etc.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Parameters */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Contribution & Pot Structure
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contribution per Member (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    min={2000}
                    step={1000}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as ContributionFrequency)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Daily">Daily Rotations</option>
                  <option value="Weekly">Weekly Rotations</option>
                  <option value="Bi-weekly">Bi-weekly (Fortnightly)</option>
                  <option value="Monthly">Monthly Rotations</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Member Slots
                </label>
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Determines cycle duration ({maxMembers} rounds)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Late Contribution Penalty (₦)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={lateFee}
                  onChange={(e) => setLateFee(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Deterrent for defaulters</span>
              </div>
            </div>
          </div>

          {/* Rotational & Admin Settings */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Rotational Distribution & Admin Status
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payout Sequence Rule
              </label>
              <select
                value={payoutRule}
                onChange={(e) => setPayoutRule(e.target.value as PayoutRule)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="First-come sequence">First-Come Sequence (Slot chosen upon joining)</option>
                <option value="Admin scheduled">Admin Scheduled (Admin assigns turn based on need)</option>
                <option value="Random balloting">Random Balloting (Automated random draw)</option>
                <option value="Bidding system">Bidding System (Discount bidding for urgent payout)</option>
              </select>
            </div>

            {/* Admin Participation Toggle (Explicitly noting admin can also join) */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    Participate as a Contributing Member
                  </span>
                  <p className="text-xs text-emerald-800/80 mt-0.5">
                    As Admin, you can participate in the contribution pool and collect a round payout yourself.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminParticipates}
                    onChange={(e) => setAdminParticipates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {adminParticipates && (
                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900">Your Preferred Payout Slot:</span>
                  <select
                    value={adminSlot}
                    onChange={(e) => setAdminSlot(Number(e.target.value))}
                    className="bg-white border border-emerald-300 rounded-lg px-2.5 py-1 font-bold text-emerald-800"
                  >
                    <option value={1}>Slot #1 (First Round Payout)</option>
                    <option value={2}>Slot #2 (Second Round Payout)</option>
                    <option value={Math.floor(maxMembers / 2)}>Slot #{Math.floor(maxMembers / 2)} (Midway Round)</option>
                    <option value={maxMembers}>Slot #{maxMembers} (Final Round Pot)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            id="create-savings-group-submit-btn"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mint Group & Generate Custom Invite UID</span>
          </button>
        </form>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Circle Preview</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ADMIN CONSOLE
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white font-heading truncate">
                {groupName || 'Untitled Ajo Circle'}
              </h2>
              <span className="text-xs text-slate-400 block mt-0.5">{category}</span>
            </div>

            {/* Custom UID Box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Custom Group UID</span>
                <button
                  type="button"
                  onClick={handleRegenerateUid}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Regenerate
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
                <span className="font-mono text-base font-extrabold text-emerald-400 tracking-wider">
                  {customUid}
                </span>
                <span className="text-[11px] text-slate-400">Unique Invite Key</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Users can join this circle simply by entering this code in their "Join a Savings Group" panel.
              </p>
            </div>

            {/* Admin Paystack Collection Account Summary */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                <span>Member Payment Destination</span>
                <span className="text-emerald-400">Paystack Verified</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Account No:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {paystackAccountNumber || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bank:</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                    {paystackBankName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Account Name:</span>
                  <span className="font-semibold text-emerald-300 truncate max-w-[180px]">
                    {paystackAccountName || 'Admin Account'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Members transfer from any bank to this Paystack account, then upload their receipt for your instant verification.
              </p>
            </div>

            {/* Pot Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Contribution per Member:</span>
                <span className="font-bold text-white">{formatNaira(contributionAmount)} / {frequency.toLowerCase()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Group Capacity:</span>
                <span className="font-bold text-white">{maxMembers} Members</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Pooled Pot Size:</span>
                <span className="font-bold text-emerald-400 text-sm">{formatNaira(totalPot)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Payout Assignment:</span>
                <span className="font-semibold text-slate-300">{payoutRule}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Admin Role:</span>
                <span className="font-semibold text-emerald-300">
                  {adminParticipates ? `Coordinator & Slot #${adminSlot} Participant` : 'Coordinator Only'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>All contributions will be verified by the Admin & secured in licensed escrow.</span>
            </div>
          </div>
        </div>

      </div>

      {/* PAYSTACK REFERRAL / CREATION GUIDANCE MODAL */}
      {showPaystackReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Paystack Account Referral
              </h3>
              <p className="text-xs text-slate-600">
                We've opened the official Paystack registration page in a new browser tab for you.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                Quick Steps to Get Your Dedicated Paystack NUBAN:
              </span>
              <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                <li>Complete your free signup on Paystack with your business or personal name.</li>
                <li>Navigate to your Paystack dashboard settings or <strong>"Dedicated Virtual Accounts"</strong>.</li>
                <li>Copy the provided <strong>10-digit Account Number (Titan Trust Bank or Wema)</strong> and <strong>Account Name</strong>.</li>
                <li>Paste them directly into this TrustPass group creation form!</li>
              </ol>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Members can pay to your Paystack account using ANY bank (GTBank, Access, Zenith, Kuda, OPay, Palmpay, etc.).</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.open('https://dashboard.paystack.com/#/signup', '_blank', 'noopener,noreferrer')}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Re-open Paystack Signup</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPaystackReferralModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                I have my Paystack Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL AFTER CREATION */}
      {createdGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">
                Ajo Circle Created!
              </h3>
              <p className="text-xs text-slate-600">
                You are now the active Admin of <strong className="text-slate-900">{createdGroup.name}</strong>. Share the custom UID below to invite members.
              </p>
            </div>

            {/* Custom UID Callout */}
            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2 text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Custom Invite UID</span>
              <div className="text-3xl font-mono font-extrabold text-emerald-400 tracking-widest">
                {createdGroup.uid}
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={copyUid}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUid ? 'UID Copied!' : 'Copy UID'}</span>
                </button>
                <button
                  type="button"
                  onClick={copyInviteLink}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Payment Destination Summary */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Your Paystack Collection Details:</span>
              <p className="text-slate-600">
                Account: <strong className="text-slate-900 font-mono">{createdGroup.paystackAccountNumber}</strong> ({createdGroup.paystackBankName})
              </p>
              <p className="text-slate-600">
                Name: <strong className="text-slate-900">{createdGroup.paystackAccountName}</strong>
              </p>
            </div>

            {/* WhatsApp Direct Invite shortcut */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">Invite via WhatsApp / SMS</span>
                <span className="text-[11px] text-emerald-700">Pre-filled text with custom UID & guidelines</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const msg = `Hello! Join my official Ajo savings circle "${createdGroup.name}" on TrustPass. Group UID: ${createdGroup.uid}. Contribution is ${formatNaira(createdGroup.contributionAmount)} (${createdGroup.frequency}). Total lump-sum pot is ${formatNaira(createdGroup.totalPotSize)}. Securely held in CBN-aligned escrow!`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
              >
                Share
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCreatedGroup(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = createdGroup.id;
                  setCreatedGroup(null);
                  onViewCreatedGroup(id);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>Manage Circle as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
