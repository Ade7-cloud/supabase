import React from 'react';
import { X, CheckCircle2, Download, Printer, Shield, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../types';
import { formatNaira } from '../data/initialData';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isCredit = transaction.type === 'deposit' || transaction.type === 'payout';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top brand header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-xs text-white">
              TP
            </div>
            <span className="font-bold tracking-tight text-sm font-heading">TrustPass Digital Ajo</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-5">
          <div className="text-center pb-4 border-b border-dashed border-slate-200">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
              isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-700'
            }`}>
              {isCredit ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Transaction Receipt</span>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1">
              {isCredit ? '+' : '-'}{formatNaira(transaction.amount)}
            </h4>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Settled in TrustPass Escrow</span>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Reference Code</span>
              <span className="font-mono font-bold text-slate-800">{transaction.reference}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Transaction Type</span>
              <span className="font-semibold text-slate-800 capitalize">{transaction.type}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Purpose / Narrative</span>
              <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">{transaction.title}</span>
            </div>

            {transaction.groupName && (
              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Ajo Circle</span>
                <span className="font-semibold text-emerald-700">{transaction.groupName}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Date & Time (WAT)</span>
              <span className="font-medium text-slate-800">{transaction.date}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Channel / Provider</span>
              <span className="font-medium text-slate-800">{transaction.paymentMethod}</span>
            </div>
          </div>

          {/* Security stamp */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-[11px] text-slate-600">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>This is an authentic digital receipt validated under the TrustPass Rotational Escrow Framework.</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => alert('Receipt downloaded as PDF (Simulated).')}
              className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
