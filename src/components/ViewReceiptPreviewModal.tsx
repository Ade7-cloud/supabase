import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight, 
  Clock,
  Check,
  FileText
} from 'lucide-react';
import { ContributionReceipt, SavingsGroup } from '../types';
import { formatNaira } from '../data/initialData';

interface ViewReceiptPreviewModalProps {
  receipt: ContributionReceipt | null;
  group?: SavingsGroup;
  isAdmin: boolean;
  onClose: () => void;
  onApproveReceipt?: (receiptId: string) => void;
  onRejectReceipt?: (receiptId: string, reason: string) => void;
}

export const ViewReceiptPreviewModal: React.FC<ViewReceiptPreviewModalProps> = ({
  receipt,
  group,
  isAdmin,
  onClose,
  onApproveReceipt,
  onRejectReceipt,
}) => {
  if (!receipt) return null;

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = () => {
    if (onApproveReceipt) {
      onApproveReceipt(receipt.id);
      onClose();
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please enter a brief reason for rejecting the receipt.');
      return;
    }
    if (onRejectReceipt) {
      onRejectReceipt(receipt.id, rejectReason.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-heading">
                Member Payment Proof & Slip
              </h3>
              <p className="text-[11px] text-slate-400">
                Receipt #{receipt.id} • {receipt.groupName}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Voucher Body */}
        <div className="p-6 space-y-5">
          
          {/* Top Amount & Status Badge */}
          <div className="text-center pb-4 border-b border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto mb-2 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Paystack Bank Transfer Receipt
            </span>
            <h4 className="text-3xl font-extrabold text-slate-900 mt-1">
              {formatNaira(receipt.amount)}
            </h4>
            
            <div className="mt-2 flex justify-center">
              {receipt.status === 'verified' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified by Admin • Round Cleared</span>
                </span>
              )}
              {receipt.status === 'pending_verification' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Admin Verification</span>
                </span>
              )}
              {receipt.status === 'rejected' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Payment Rejected</span>
                </span>
              )}
            </div>
          </div>

          {/* Breakdown List */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Member (Sender)</span>
              <span className="font-bold text-slate-900">{receipt.memberName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Sending Bank</span>
              <span className="font-semibold text-slate-800">{receipt.senderBankName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Sender Account Name</span>
              <span className="font-semibold text-slate-800">{receipt.senderAccountName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Destination Account</span>
              <span className="font-mono font-bold text-emerald-800">
                {group ? `${group.paystackAccountNumber} (${group.paystackBankName})` : 'Paystack Account'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Ajo Circle & Cycle</span>
              <span className="font-semibold text-slate-800">{receipt.groupName} • Round {receipt.roundNumber}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Uploaded At</span>
              <span className="font-medium text-slate-800">{receipt.uploadedAt}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Attached Slip</span>
              <span className="font-mono font-bold text-slate-800">{receipt.receiptFileName}</span>
            </div>

            {receipt.notes && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                <span className="text-[11px] font-bold text-slate-600 block uppercase">Member Note:</span>
                <p className="text-xs text-slate-800 mt-0.5">{receipt.notes}</p>
              </div>
            )}

            {receipt.status === 'rejected' && receipt.rejectionReason && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 mt-2">
                <span className="text-[11px] font-bold text-red-800 block uppercase">Admin Rejection Reason:</span>
                <p className="text-xs text-red-700 mt-0.5">{receipt.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Admin Verification Controls */}
          {isAdmin && receipt.status === 'pending_verification' && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Admin Verification Action
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-snug">
                Check your Paystack dashboard to confirm credit of <strong>{formatNaira(receipt.amount)}</strong> from <strong>{receipt.senderAccountName}</strong>.
              </p>

              {showRejectInput ? (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason (e.g. Reference not found)"
                    className="w-full px-3 py-2 bg-white border border-red-300 rounded-xl text-xs text-slate-900"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Mark Paid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(true)}
                    className="py-2 px-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* General Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => alert(`Payment slip "${receipt.receiptFileName}" downloaded.`)}
              className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Slip</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
