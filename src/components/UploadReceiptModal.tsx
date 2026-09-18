import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Image as ImageIcon
} from 'lucide-react';
import { SavingsGroup, User, ContributionReceipt } from '../types';
import { formatNaira } from '../data/initialData';

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: SavingsGroup;
  currentUser: User;
  onSubmitReceipt: (receipt: ContributionReceipt) => void;
}

export const UploadReceiptModal: React.FC<UploadReceiptModalProps> = ({
  isOpen,
  onClose,
  group,
  currentUser,
  onSubmitReceipt,
}) => {
  if (!isOpen) return null;

  const [senderBank, setSenderBank] = useState('Guaranty Trust Bank (GTBank)');
  const [senderAccountName, setSenderAccountName] = useState(currentUser.fullName);
  const [transferNarration, setTransferNarration] = useState(`${group.uid} Round ${group.currentRound} - ${currentUser.fullName}`);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [receiptFilePreview, setReceiptFilePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyPaystackAccount = () => {
    navigator.clipboard.writeText(group.paystackAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setReceiptFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptFilePreview(null);
      }
    }
  };

  const handleUseSampleReceipt = () => {
    const sampleName = `Paystack_Transfer_Slip_${group.uid}_${Date.now().toString().slice(-4)}.pdf`;
    setReceiptFileName(sampleName);
    setReceiptFilePreview(null);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!receiptFileName) {
      setErrorMessage('Please attach or upload your bank payment receipt / transfer slip.');
      return;
    }

    if (!senderAccountName.trim()) {
      setErrorMessage('Please input the sender account name on the transfer slip.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const nowStr = new Intl.DateTimeFormat('en-NG', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date());

      const newReceipt: ContributionReceipt = {
        id: `rcpt_${Date.now()}`,
        groupId: group.id,
        groupName: group.name,
        roundNumber: group.currentRound,
        memberId: currentUser.id,
        memberName: currentUser.fullName,
        memberEmail: currentUser.email,
        memberPhone: currentUser.phone,
        amount: group.contributionAmount,
        receiptFileName: receiptFileName || 'Transfer_Receipt.pdf',
        receiptFileUrl: receiptFilePreview || undefined,
        senderAccountName: senderAccountName.trim(),
        senderBankName: senderBank,
        uploadedAt: `${nowStr} WAT`,
        status: 'pending_verification',
        notes: notes.trim() || transferNarration,
      };

      onSubmitReceipt(newReceipt);
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-heading">
                Upload Proof of Payment / Receipt
              </h3>
              <p className="text-[11px] text-slate-400">
                {group.name} • Round {group.currentRound} ({formatNaira(group.contributionAmount)})
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Admin Paystack Destination Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-950 font-bold uppercase tracking-wider text-[11px]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Admin Paystack Account Details</span>
              </span>
              <span className="text-emerald-700 font-normal">Pay with ANY Bank</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Bank Name:</span>
                <span className="font-bold text-slate-900">{group.paystackBankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Account Number:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-extrabold text-emerald-700 text-sm">
                    {group.paystackAccountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={copyPaystackAccount}
                    className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                    title="Copy Account Number"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Account Name:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                  {group.paystackAccountName}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Amount Due:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {formatNaira(group.contributionAmount)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-900 leading-snug">
              Note: You can transfer from GTBank, Access, Zenith, Kuda, OPay, Palmpay, or any Nigerian bank. Once sent, upload the transfer receipt below for the Admin's verification.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sender Bank Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Sending Bank *
              </label>
              <select
                value={senderBank}
                onChange={(e) => setSenderBank(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                <option value="Access Bank Plc">Access Bank Plc</option>
                <option value="Zenith Bank Plc">Zenith Bank Plc</option>
                <option value="Kuda Microfinance Bank">Kuda Microfinance Bank</option>
                <option value="OPay Digital Services">OPay Digital Services</option>
                <option value="Palmpay">Palmpay</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                <option value="Moniepoint MFB">Moniepoint MFB</option>
                <option value="Sterling Bank">Sterling Bank</option>
                <option value="Fidelity Bank">Fidelity Bank</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sender Account Name *
              </label>
              <input
                type="text"
                value={senderAccountName}
                onChange={(e) => setSenderAccountName(e.target.value)}
                placeholder="Name showing on your transfer slip"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Attach Payment Receipt (Image or PDF) *
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 border-2 border-dashed rounded-2xl text-center cursor-pointer transition ${
                receiptFileName 
                  ? 'border-emerald-500 bg-emerald-50/40' 
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {receiptFileName ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[280px] mx-auto">
                      {receiptFileName}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      File attached • Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="w-7 h-7 mx-auto text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drag & drop transfer receipt
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports PNG, JPG, JPEG, or PDF (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Quick Demo Attachment Shortcut */}
            <div className="flex justify-between items-center mt-2 text-[11px]">
              <span className="text-slate-500">Testing in sandbox?</span>
              <button
                type="button"
                onClick={handleUseSampleReceipt}
                className="text-emerald-700 font-bold hover:underline"
              >
                + Attach Simulated Bank Transfer Slip
              </button>
            </div>
          </div>

          {/* Optional Note / Narration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment Narration / Reference
            </label>
            <input
              type="text"
              value={transferNarration}
              onChange={(e) => setTransferNarration(e.target.value)}
              placeholder="e.g. TP-AJO-7721 Round 3 payment"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
          </div>

          {/* Automated Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>This receipt will be sent automatically to Admin <strong>{group.adminName}</strong> for instant payment verification.</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-receipt-btn"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Submitting to Admin...</span>
              ) : (
                <>
                  <span>Send Receipt to Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
