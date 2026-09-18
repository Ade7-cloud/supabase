import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  KeyRound, 
  Coins, 
  Calendar,
  Filter,
  Check,
  Info
} from 'lucide-react';
import { User, SavingsGroup } from '../types';
import { formatNaira } from '../data/initialData';

interface JoinGroupViewProps {
  currentUser: User;
  groups: SavingsGroup[];
  onJoinGroup: (group: SavingsGroup, selectedSlot: number) => void;
  onViewDetails: (group: SavingsGroup) => void;
}

export const JoinGroupView: React.FC<JoinGroupViewProps> = ({
  currentUser,
  groups,
  onJoinGroup,
  onViewDetails,
}) => {
  // Input UID for custom join
  const [inputUid, setInputUid] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [joinedGroupId, setJoinedGroupId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Lookup group by custom UID
  const foundGroupByUid = inputUid.trim()
    ? groups.find((g) => g.uid.toUpperCase() === inputUid.trim().toUpperCase())
    : null;

  // Filtered public groups
  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.adminName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinSubmit = (groupToJoin: SavingsGroup, slot: number) => {
    setErrorMessage('');
    
    // Check if user is already in this group
    const isAlreadyMember = groupToJoin.members.some((m) => m.userId === currentUser.id);
    if (isAlreadyMember) {
      setErrorMessage(`You are already a member of "${groupToJoin.name}".`);
      return;
    }

    if (groupToJoin.currentMembersCount >= groupToJoin.maxMembers) {
      setErrorMessage('This circle has already filled all available member slots.');
      return;
    }

    onJoinGroup(groupToJoin, slot);
    setJoinedGroupId(groupToJoin.id);
    setTimeout(() => {
      setJoinedGroupId(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-2">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Universal Member Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
          Join a Savings Group (Ajo Circle)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Enter a custom invite UID provided by your circle admin, or browse open verified contribution groups across Nigeria.
        </p>
      </div>

      {/* Admin Notice Banner: Admins can also join groups! */}
      <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-800 shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 text-xs">
          <span className="font-bold text-white text-sm">Universal Admin Participation</span>
          <p className="text-emerald-200/90 leading-relaxed">
            Note: Even if you are already an Admin who created other savings circles, you can still join other groups as a contributing member. Your wallet and payouts are consolidated seamlessly under your single TrustPass identity.
          </p>
        </div>
      </div>

      {/* SECTION 1: JOIN VIA CUSTOM UID */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Join with Custom Group UID
            </h2>
            <p className="text-xs text-slate-500">Every TrustPass group has a unique alphanumeric invite code (e.g. TP-AJO-7721).</p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter Group UID
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="join-group-uid-input"
                  value={inputUid}
                  onChange={(e) => {
                    setInputUid(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  placeholder="e.g. TP-AJO-7721 or TP-AJO-3390"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold tracking-wider text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white uppercase"
                />
              </div>

              <div className="flex gap-2">
                {/* Sample quick fill buttons for demo */}
                {groups.slice(0, 2).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setInputUid(g.uid);
                      setErrorMessage('');
                    }}
                    className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-slate-200 text-slate-600 transition whitespace-nowrap"
                  >
                    Use {g.uid}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* If UID matches a group: show Preview & Join Action */}
          {foundGroupByUid ? (
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      {foundGroupByUid.uid}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Verified Circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{foundGroupByUid.name}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{foundGroupByUid.description}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 block">Circle Admin</span>
                  <span className="text-sm font-bold text-slate-900">{foundGroupByUid.adminName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block font-medium">Round Contribution</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatNaira(foundGroupByUid.contributionAmount)}
                  </span>
                  <span className="text-[10px] text-slate-500"> / {foundGroupByUid.frequency}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block font-medium">Total Lump-Sum Pot</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {formatNaira(foundGroupByUid.totalPotSize)}
                  </span>
                  <span className="text-[10px] text-slate-500">at your turn</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block font-medium">Slots Filled</span>
                  <span className="text-sm font-bold text-slate-900">
                    {foundGroupByUid.currentMembersCount} of {foundGroupByUid.maxMembers}
                  </span>
                  <span className="text-[10px] text-emerald-600">
                    {foundGroupByUid.maxMembers - foundGroupByUid.currentMembersCount} remaining
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block font-medium">Payout Rule</span>
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {foundGroupByUid.payoutRule}
                  </span>
                  <span className="text-[10px] text-slate-500">Fair rotation</span>
                </div>
              </div>

              {/* Slot selector & Join button */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                    Choose Your Payout Turn:
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(Number(e.target.value))}
                    className="bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-800"
                  >
                    {Array.from({ length: foundGroupByUid.maxMembers }, (_, i) => i + 1)
                      .filter((slot) => !foundGroupByUid.members.some((m) => m.slotNumber === slot))
                      .map((slot) => (
                        <option key={slot} value={slot}>
                          Slot #{slot} (Round {slot} Payout)
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="button"
                  id="confirm-join-by-uid-btn"
                  onClick={() => handleJoinSubmit(foundGroupByUid, selectedSlot)}
                  disabled={joinedGroupId === foundGroupByUid.id}
                  className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {joinedGroupId === foundGroupByUid.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Successfully Joined Circle!</span>
                    </>
                  ) : (
                    <>
                      <span>Join This Savings Circle</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : inputUid.trim() ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No circle found with UID <strong className="text-slate-800 font-mono font-bold">"{inputUid}"</strong>. Check the code with your admin or browse public groups below.
            </div>
          ) : null}
        </div>
      </section>

      {/* SECTION 2: BROWSE PUBLIC SAVINGS CIRCLES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Browse Open Verified Circles
            </h2>
            <p className="text-xs text-slate-500">
              Explore public Ajo circles currently recruiting trusted members across Nigeria.
            </p>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circles or admins..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Business">Business</option>
              <option value="Rent & Housing">Rent & Housing</option>
              <option value="Personal Savings">Personal Savings</option>
            </select>
          </div>
        </div>

        {/* Group Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.map((group) => {
            const isMember = group.members.some((m) => m.userId === currentUser.id);
            const isAdmin = group.adminId === currentUser.id;
            const isFull = group.currentMembersCount >= group.maxMembers;

            return (
              <div 
                key={group.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {group.uid}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {group.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{group.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contribution:</span>
                      <span className="font-bold text-slate-900">
                        {formatNaira(group.contributionAmount)} / {group.frequency.toLowerCase()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Pot:</span>
                      <span className="font-bold text-emerald-700">
                        {formatNaira(group.totalPotSize)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Admin Coordinator:</span>
                      <span className="font-semibold text-slate-800">{group.adminName}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-1">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Slots: {group.currentMembersCount}/{group.maxMembers}</span>
                        <span>{Math.round((group.currentMembersCount / group.maxMembers) * 100)}% filled</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${(group.currentMembersCount / group.maxMembers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails(group)}
                    className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition"
                  >
                    View Schedule
                  </button>

                  {isMember ? (
                    <button
                      type="button"
                      disabled
                      className="py-2 px-3 bg-slate-100 text-slate-500 font-semibold text-xs rounded-xl cursor-default"
                    >
                      {isAdmin ? 'Your Circle (Admin)' : 'Joined'}
                    </button>
                  ) : isFull ? (
                    <button
                      type="button"
                      disabled
                      className="py-2 px-3 bg-slate-100 text-slate-400 font-semibold text-xs rounded-xl cursor-not-allowed"
                    >
                      Full
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const availableSlot = Array.from({ length: group.maxMembers }, (_, i) => i + 1)
                          .find((s) => !group.members.some((m) => m.slotNumber === s)) || group.currentMembersCount + 1;
                        handleJoinSubmit(group, availableSlot);
                      }}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
