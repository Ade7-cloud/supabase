import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Calculator, 
  Users, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  AlertTriangle, 
  RotateCw,
  Clock,
  Banknote,
  ChevronDown
} from 'lucide-react';
import { formatNaira } from '../data/initialData';

interface ExploreLearnMoreProps {
  onNavigateToCreate: () => void;
  onNavigateToJoin: () => void;
}

export const ExploreLearnMore: React.FC<ExploreLearnMoreProps> = ({
  onNavigateToCreate,
  onNavigateToJoin,
}) => {
  // Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(50000);
  const [calcMembers, setCalcMembers] = useState<number>(10);
  const [calcFrequency, setCalcFrequency] = useState<'Weekly' | 'Monthly'>('Monthly');

  // FAQ open index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const totalPot = calcAmount * calcMembers;
  const cycleDuration = calcFrequency === 'Weekly' ? `${calcMembers} Weeks` : `${calcMembers} Months`;

  const faqs = [
    {
      q: 'What is Ajo / Esusu and how does TrustPass digitize it?',
      a: 'Ajo (also known as Esusu in Yoruba, Adashe in Hausa, or Isusu in Igbo) is a traditional rotational thrift savings arrangement where a trusted group pools funds at set intervals and takes turns collecting the entire pooled lump-sum. TrustPass digitizes this cultural practice by providing automated debits, a secure bank-backed escrow vault, tamper-proof rotation tracking, and custom invite UIDs so no collector can run away with your hard-earned funds.',
    },
    {
      q: 'Can a Group Admin also join their own or other savings groups?',
      a: 'Yes! Group admins can participate as an active contributing member in their own group (taking a turn to receive the payout), and admins can also use the "Join a Savings Group" option to join any other circles created across Nigeria.',
    },
    {
      q: 'How does the Custom Group UID work for invites?',
      a: 'Every time an admin creates a group, TrustPass generates a unique custom UID (e.g. TP-AJO-7721). The admin shares this UID with friends, colleagues, or family. Prospective members simply click "Join a Savings Group", paste the UID, and request access or pick an available payout slot.',
    },
    {
      q: 'What happens if a member fails or delays to contribute on their due date?',
      a: 'TrustPass utilizes automated debit mandates, BVN identity verification, and customizable late-fee penalties configured by the group admin. Furthermore, members who have not yet received their payout have their upcoming payouts prioritized or paused until their accounts are in good standing.',
    },
    {
      q: 'How are the lump-sum payouts disbursed to the beneficiary?',
      a: 'When a cycle round concludes (e.g. Round 3 on the 1st of the month), the TrustPass escrow engine automatically releases the total collective pot directly into the beneficiary’s TrustPass wallet. From there, the beneficiary can instantly withdraw to any Nigerian commercial bank (GTBank, Zenith, Access, Kuda, etc.) with zero holding fees.',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 border border-slate-700 shadow-xl text-white">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FINTECH ARCHITECTURE FOR CULTURAL SAVINGS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
            How Digital <span className="text-emerald-400">"Ajo"</span> Works on TrustPass
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In Nigeria, rotational savings (Ajo/Esusu) have fueled businesses, school fees, and rent for generations. TrustPass brings modern transparency, instant wallet payouts, and automated escrow to protect every kobo.
          </p>
          <div className="pt-3 flex flex-wrap gap-3">
            <button
              id="explore-create-btn"
              onClick={onNavigateToCreate}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Create Your Own Circle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="explore-join-btn"
              onClick={onNavigateToJoin}
              className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-600 transition flex items-center gap-2"
            >
              <span>Join with Custom UID</span>
            </button>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-emerald-600/10 blur-3xl pointer-events-none" />
      </section>

      {/* Interactive 4-Step Rotational Lifecycle */}
      <section className="space-y-4">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Step-by-Step Mechanics</span>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">The Rotational Thrift Lifecycle</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Admin Creates Circle</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Admin specifies contribution sum (e.g. ₦50,000), frequency (weekly/monthly), and capacity. A custom UID is instantly minted.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Members Join via UID</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Members input the custom UID, accept circle rules, and lock in their preferred payout turn in the rotational queue.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Automated Collection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every round, funds are debited and placed into a tamper-proof trustee escrow. No individual can withdraw early.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-base">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Lump-Sum Disbursed</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The assigned beneficiary receives the full collective pot into their wallet. Cycle repeats until every member is paid!
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Ajo Payout Calculator */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 font-heading">Interactive Ajo Lump-Sum Simulator</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Estimate the capital pot you can unlock by pooling contributions with your circle.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            Zero Interest • 100% Capital Return
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Amount Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contribution per Member
                </label>
                <span className="text-base font-extrabold text-emerald-700">
                  {formatNaira(calcAmount)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={250000}
                step={5000}
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₦5,000 (Micro)</span>
                <span>₦50,000 (Standard)</span>
                <span>₦250,000 (Premium)</span>
              </div>
            </div>

            {/* Members Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Number of Members in Circle
                </label>
                <span className="text-base font-extrabold text-slate-800">
                  {calcMembers} Members
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                step={1}
                value={calcMembers}
                onChange={(e) => setCalcMembers(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>3 (Close friends)</span>
                <span>10 (Recommended)</span>
                <span>20 (Corporate/Union)</span>
              </div>
            </div>

            {/* Frequency Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contribution Frequency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCalcFrequency('Weekly')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    calcFrequency === 'Weekly'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Weekly Cycle
                </button>
                <button
                  type="button"
                  onClick={() => setCalcFrequency('Monthly')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    calcFrequency === 'Monthly'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Monthly Cycle
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-lg space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Total Lump-Sum Payout</span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {formatNaira(totalPot)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Collected by each member when their rotational turn arrives.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Your Individual Commitment:</span>
                <span className="font-semibold text-slate-200">{formatNaira(calcAmount)} / {calcFrequency.toLowerCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Circle Rounds:</span>
                <span className="font-semibold text-slate-200">{calcMembers} Rounds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Cycle Duration:</span>
                <span className="font-semibold text-emerald-400">{cycleDuration}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToCreate}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              <span>Launch This Exact Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Escrow Guarantee Pillars */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Why TrustPass</span>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Traditional Ajo vs. TrustPass Digitalization</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Traditional Paper Ajo</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Collector can disappear with cash pool.</li>
              <li>Arguments and disputes over whose turn is next.</li>
              <li>Manual cash carrying risks robbery or loss.</li>
              <li>Defaulting members hold the whole group hostage.</li>
            </ul>
          </div>

          <div className="p-6 bg-emerald-950 text-white rounded-2xl border border-emerald-800 space-y-2.5 shadow-md md:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-emerald-300 text-base">The TrustPass Digital Advantage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="space-y-1">
                <span className="font-bold text-white block">Bank-Grade Escrow Vault</span>
                <p>Funds never enter the admin's personal account. Direct automated payout to winner's wallet.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white block">Custom Invite UIDs</span>
                <p>Private, unique identifiers ensure only vetted participants join your specific circle.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white block">BVN / NIN Verification</span>
                <p>Identity is legally validated before any member is permitted to lock in their slot.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white block">Rotational Wheel Transparency</span>
                <p>Every member tracks in real time who has paid and when their turn arrives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900 font-heading">Frequently Asked Questions</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3.5">
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left gap-3"
              >
                <span className="font-bold text-slate-800 text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === idx && (
                <p className="mt-2 text-xs text-slate-600 leading-relaxed animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
