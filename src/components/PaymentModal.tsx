import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Lock,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { formatNaira } from '../data/initialData';
import { User, Transaction } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'fund' | 'withdraw' | 'contribute';
  user: User;
  groupContext?: {
    id: string;
    name: string;
    amount: number;
    round: number;
    paystackAccountNumber?: string;
    paystackAccountName?: string;
    paystackBankName?: string;
  };
  onSuccess: (amount: number, description: string, paymentMethod: string, txType: 'deposit' | 'contribution' | 'withdrawal') => void;
  onOpenUploadReceipt?: (groupId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  type,
  user,
  groupContext,
  onSuccess,
  onOpenUploadReceipt
}) => {
  if (!isOpen) return null;

  // Tabs for funding
  const [fundMethod, setFundMethod] = useState<'card' | 'bank_transfer' | 'ussd'>('bank_transfer');
  const [contributeMethod, setContributeMethod] = useState<'wallet' | 'paystack_transfer'>('wallet');
  
  // Form states
  const [amount, setAmount] = useState<number>(groupContext ? groupContext.amount : 25000);
  const [cardNumber, setCardNumber] = useState('5399 •••• •••• 4021');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [destinationBank, setDestinationBank] = useState(user.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState(user.accountNumber || '0234891104');
  const [pin, setPin] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedPaystack, setCopiedPaystack] = useState(false);

  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (type === 'withdraw') {
      if (amount > user.walletBalance) {
        setErrorMessage(`Insufficient wallet balance. You have ${formatNaira(user.walletBalance)} available.`);
        return;
      }
      if (amount < 2000) {
        setErrorMessage('Minimum withdrawal amount is ₦2,000.');
        return;
      }
      if (pin !== user.transactionPin && pin !== '1234') {
        setErrorMessage('Incorrect 4-digit transaction PIN. (Demo default PIN is 1234)');
        return;
      }
    }

    if (type === 'contribute') {
      if (amount > user.walletBalance) {
        setErrorMessage(`Insufficient wallet balance. Please fund your wallet with at least ${formatNaira(amount - user.walletBalance)}.`);
        return;
      }
      if (pin !== user.transactionPin && pin !== '1234') {
        setErrorMessage('Incorrect 4-digit transaction PIN to authorize escrow debit.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate real-time payment gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        let desc = '';
        let pMethod = '';
        let txType: 'deposit' | 'contribution' | 'withdrawal' = 'deposit';

        if (type === 'fund') {
          desc = `Wallet funded via ${fundMethod === 'bank_transfer' ? 'Virtual Bank Transfer' : fundMethod === 'card' ? 'Paystack Debit Card' : 'GTBank USSD'}`;
          pMethod = fundMethod === 'bank_transfer' ? 'Wema Bank Virtual Account (9928374829)' : fundMethod === 'card' ? 'Mastercard ending in 4021' : 'USSD *737#';
          txType = 'deposit';
        } else if (type === 'withdraw') {
          desc = `Withdrawal to ${destinationBank} (${accountNumber})`;
          pMethod = 'NIP Instant Bank Settlement';
          txType = 'withdrawal';
        } else if (type === 'contribute') {
          desc = `Round ${groupContext?.round || 1} contribution to ${groupContext?.name || 'Ajo Group'}`;
          pMethod = 'TrustPass Verified Escrow Debit';
          txType = 'contribution';
        }

        onSuccess(amount, desc, pMethod, txType);
        onClose();
      }, 1400);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                {type === 'fund' && 'Fund TrustPass Wallet'}
                {type === 'withdraw' && 'Withdraw Funds to Bank'}
                {type === 'contribute' && `Pay Ajo Round Contribution`}
              </h3>
              <p className="text-xs text-slate-300">
                Secured by CBN-compliant 256-Bit SSL Escrow
              </p>
            </div>
          </div>
          <button 
            id="close-payment-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing / Success State */}
        {isProcessing && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <h4 className="text-lg font-semibold text-slate-800">Processing Transaction...</h4>
            <p className="text-sm text-slate-500 max-w-xs">
              Routing through Nigeria Inter-Bank Settlement System (NIBSS) & TrustPass Escrow Vault. Please wait.
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Transaction Successful!</h4>
            <p className="text-sm text-slate-600">
              {type === 'fund' && `Successfully added ${formatNaira(amount)} to your wallet balance.`}
              {type === 'withdraw' && `Dispatched ${formatNaira(amount)} to ${destinationBank}.`}
              {type === 'contribute' && `Contribution of ${formatNaira(amount)} locked in group escrow.`}
            </p>
          </div>
        )}

        {/* Modal Form Content */}
        {!isProcessing && !isSuccess && (
          <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* FUND WALLET VIEW */}
            {type === 'fund' && (
              <div className="space-y-4">
                {/* Method selector tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setFundMethod('bank_transfer')}
                    className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                      fundMethod === 'bank_transfer'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFundMethod('card')}
                    className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                      fundMethod === 'card'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFundMethod('ussd')}
                    className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                      fundMethod === 'ussd'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>USSD</span>
                  </button>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deposit Amount (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      placeholder="e.g. 50000"
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[10000, 25000, 50000, 100000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-slate-200 text-slate-600 transition"
                      >
                        +{formatNaira(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank Transfer Details */}
                {fundMethod === 'bank_transfer' && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase text-emerald-800">Your Dedicated Virtual Account</span>
                        <p className="text-xs text-slate-600 mt-0.5">Transfer any amount to automatically fund your TrustPass wallet.</p>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-200/60 text-emerald-800 rounded">Instant Credit</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-emerald-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Bank Name</span>
                        <span className="text-sm font-bold text-slate-800">Wema Bank / Providus Bank</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Account Number</span>
                        <span className="text-sm font-mono font-bold text-emerald-700">9928374829</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('9928374829')}
                        className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="Copy Account Number"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {copied && (
                      <p className="text-xs text-emerald-600 font-medium text-center">
                        Account number copied to clipboard!
                      </p>
                    )}

                    <p className="text-[11px] text-slate-500 text-center">
                      Account Name: <strong className="text-slate-700">TrustPass / {user.fullName}</strong>
                    </p>
                  </div>
                )}

                {/* Debit Card Fields */}
                {fundMethod === 'card' && (
                  <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="5399 •••• •••• ••••"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono"
                          placeholder="•••"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* USSD Details */}
                {fundMethod === 'ussd' && (
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-center space-y-2">
                    <p className="text-xs text-amber-800 font-medium">Dial this USSD code on your registered Nigerian phone number:</p>
                    <div className="text-lg font-mono font-bold text-amber-900 bg-white py-2 px-3 rounded-lg border border-amber-200 inline-block">
                      *737*50*{amount}*9928#
                    </div>
                    <p className="text-[11px] text-slate-500">Supports GTBank, Zenith (*966#), Access (*901#), UBA (*919#)</p>
                  </div>
                )}
              </div>
            )}

            {/* WITHDRAW VIEW */}
            {type === 'withdraw' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Available Balance</span>
                    <p className="text-base font-bold text-slate-900">{formatNaira(user.walletBalance)}</p>
                  </div>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                    No Payout Withholding Fee
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Amount to Withdraw (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>
                    <input
                      type="number"
                      min={2000}
                      max={user.walletBalance}
                      step={1000}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Destination Commercial Bank
                  </label>
                  <select
                    value={destinationBank}
                    onChange={(e) => setDestinationBank(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="Kuda Microfinance Bank">Kuda Microfinance Bank</option>
                    <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                    <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                    <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                    <option value="OPay / Moniepoint">OPay / Moniepoint Digital</option>
                  </select>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Account Number</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                      placeholder="10-digit NUBAN"
                      required
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified: {user.fullName}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Security Transaction PIN (4-Digits)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">Default demo PIN: 1234</span>
                  </div>
                </div>
              </div>
            )}

            {/* CONTRIBUTE VIEW */}
            {type === 'contribute' && groupContext && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-emerald-900">Group Name</span>
                    <span className="font-bold text-slate-800">{groupContext.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-emerald-900">Cycle Turn</span>
                    <span className="font-medium text-slate-700">Round {groupContext.round}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-200 text-sm">
                    <span className="font-bold text-emerald-900">Mandatory Contribution</span>
                    <span className="font-bold text-emerald-800 text-base">{formatNaira(groupContext.amount)}</span>
                  </div>
                </div>

                {/* Contribution Method Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setContributeMethod('wallet')}
                    className={`py-2 px-3 rounded-lg transition ${
                      contributeMethod === 'wallet'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Wallet Balance Debit
                  </button>
                  <button
                    type="button"
                    onClick={() => setContributeMethod('paystack_transfer')}
                    className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1 ${
                      contributeMethod === 'paystack_transfer'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Paystack Transfer</span>
                  </button>
                </div>

                {contributeMethod === 'wallet' ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Wallet Available Balance:</span>
                      <span className="font-bold text-slate-900">{formatNaira(user.walletBalance)}</span>
                    </div>

                    {user.walletBalance < groupContext.amount ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
                        <p>Your wallet balance is too low for this round. Switch to Paystack Transfer to pay directly from your bank app, or fund your wallet.</p>
                        <button
                          type="button"
                          onClick={() => setContributeMethod('paystack_transfer')}
                          className="font-bold text-emerald-700 underline"
                        >
                          Switch to Direct Paystack Bank Transfer →
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Enter 4-digit PIN to Authorize Escrow Contribution
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="••••"
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                          <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1">Default demo PIN: 1234</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <span>Admin's Paystack Collection Account</span>
                      </span>
                      <span className="text-[11px] text-emerald-700 font-normal">Any Bank Accepted</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bank:</span>
                        <span className="font-bold text-slate-900">{groupContext.paystackBankName || 'Titan Trust Bank / Wema Bank'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Number:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-emerald-700 text-sm">
                            {groupContext.paystackAccountNumber || '9920194821'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(groupContext.paystackAccountNumber || '9920194821');
                              setCopiedPaystack(true);
                              setTimeout(() => setCopiedPaystack(false), 2000);
                            }}
                            className="text-slate-400 hover:text-emerald-700"
                          >
                            {copiedPaystack ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Name:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {groupContext.paystackAccountName || 'TrustPass Admin Dedicated'}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Amount:</span>
                        <span className="font-bold text-emerald-800">{formatNaira(groupContext.amount)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-900 leading-snug">
                      Make the transfer using your bank app (GTBank, Access, Zenith, Kuda, OPay, etc.). After sending, click below to upload your transfer receipt for immediate admin verification.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenUploadReceipt) {
                          onOpenUploadReceipt(groupContext.id);
                        }
                      }}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>I Have Transferred • Upload Receipt</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              {!(type === 'contribute' && contributeMethod === 'paystack_transfer') && (
                <button
                  type="submit"
                  id="confirm-payment-action-btn"
                  disabled={type === 'contribute' && groupContext ? user.walletBalance < groupContext.amount : false}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md hover:shadow transition flex items-center justify-center gap-1.5"
                >
                  {type === 'fund' && (
                    <>
                      <ArrowDownRight className="w-4 h-4" />
                      <span>Confirm Deposit</span>
                    </>
                  )}
                  {type === 'withdraw' && (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Authorize Withdrawal</span>
                    </>
                  )}
                  {type === 'contribute' && (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Deposit into Escrow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
