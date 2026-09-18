import React, { useState, useEffect } from 'react';
import { 
  initialCurrentUser, 
  initialGroups, 
  initialTransactions,
  initialReceipts,
  formatNaira
} from './data/initialData';
import { User, SavingsGroup, Transaction, ContributionReceipt } from './types';
import { AuthTwoPane } from './components/AuthTwoPane';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ExploreLearnMore } from './components/ExploreLearnMore';
import { CreateGroupView } from './components/CreateGroupView';
import { JoinGroupView } from './components/JoinGroupView';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { GroupDetailModal } from './components/GroupDetailModal';
import { UploadReceiptModal } from './components/UploadReceiptModal';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('trustpass_auth_v1');
    return saved === 'true';
  });

  // User state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('trustpass_user_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialCurrentUser;
  });

  // Groups state
  const [groups, setGroups] = useState<SavingsGroup[]>(() => {
    const saved = localStorage.getItem('trustpass_groups_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialGroups;
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('trustpass_txs_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialTransactions;
  });

  // Receipts state for Paystack bank transfers
  const [receipts, setReceipts] = useState<ContributionReceipt[]>(() => {
    const saved = localStorage.getItem('trustpass_receipts_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialReceipts;
  });

  // Navigation tab state (Dashboard + 3 exact requested options: explore, create_group, join_group)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explore' | 'create_group' | 'join_group'>('dashboard');

  // Modals state
  const [paymentModalConfig, setPaymentModalConfig] = useState<{
    isOpen: boolean;
    type: 'fund' | 'withdraw' | 'contribute';
    groupContext?: {
      id: string;
      name: string;
      amount: number;
      round: number;
      paystackAccountNumber?: string;
      paystackAccountName?: string;
      paystackBankName?: string;
    };
  }>({
    isOpen: false,
    type: 'fund',
  });

  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [selectedGroupModal, setSelectedGroupModal] = useState<SavingsGroup | null>(null);
  const [uploadReceiptGroup, setUploadReceiptGroup] = useState<SavingsGroup | null>(null);
  const [alertNotification, setAlertNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('trustpass_auth_v1', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('trustpass_user_v1', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('trustpass_groups_v1', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('trustpass_txs_v1', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('trustpass_receipts_v1', JSON.stringify(receipts));
  }, [receipts]);

  // Flash alert helper
  const triggerNotification = (msg: string) => {
    setAlertNotification(msg);
    setTimeout(() => setAlertNotification(null), 3500);
  };

  // Auth Handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    triggerNotification(`Welcome to TrustPass, ${user.fullName}!`);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  // Payment Success Handler
  const handlePaymentSuccess = (
    amount: number, 
    description: string, 
    paymentMethod: string, 
    txType: 'deposit' | 'contribution' | 'withdrawal'
  ) => {
    const newTxId = `tx_${Date.now()}`;
    const refCode = `TP-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());

    let title = '';
    let status: 'success' | 'escrow' = 'success';

    if (txType === 'deposit') {
      title = 'Wallet Funded via Direct Channel';
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + amount,
        totalSaved: prev.totalSaved + amount,
      }));
      triggerNotification(`Wallet successfully credited with ${formatNaira(amount)}.`);
    } else if (txType === 'withdrawal') {
      title = 'Funds Withdrawn to Bank Account';
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
      }));
      triggerNotification(`Withdrew ${formatNaira(amount)} to your verified bank.`);
    } else if (txType === 'contribution') {
      title = 'Rotational Contribution Debited';
      status = 'escrow';

      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        lockedEscrowBalance: prev.lockedEscrowBalance + amount,
      }));

      // Mark the group's current member as paid
      if (paymentModalConfig.groupContext) {
        const targetGroupId = paymentModalConfig.groupContext.id;
        setGroups((prevGroups) =>
          prevGroups.map((grp) => {
            if (grp.id !== targetGroupId) return grp;
            return {
              ...grp,
              members: grp.members.map((mem) => {
                if (mem.userId === currentUser.id) {
                  return { ...mem, hasPaidCurrentCycle: true };
                }
                return mem;
              }),
            };
          })
        );
      }
      triggerNotification(`Contribution of ${formatNaira(amount)} deposited into circle escrow.`);
    }

    const newTx: Transaction = {
      id: newTxId,
      reference: refCode,
      type: txType,
      title,
      description,
      amount,
      date: `${nowStr} WAT`,
      timestamp: Date.now(),
      status,
      groupId: paymentModalConfig.groupContext?.id,
      groupName: paymentModalConfig.groupContext?.name,
      paymentMethod,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Group Creation Handler
  const handleGroupCreated = (newGroup: SavingsGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    triggerNotification(`Created "${newGroup.name}" with custom UID: ${newGroup.uid}!`);
  };

  // Group Joining Handler
  const handleJoinGroup = (groupToJoin: SavingsGroup, chosenSlot: number) => {
    const newMemberRecord = {
      id: `mem_${Date.now()}`,
      userId: currentUser.id,
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      slotNumber: chosenSlot,
      hasPaidCurrentCycle: false,
      hasReceivedPayout: false,
      payoutDate: '2026-11-01',
      isCurrentUser: true,
    };

    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== groupToJoin.id) return g;
        return {
          ...g,
          currentMembersCount: g.currentMembersCount + 1,
          members: [...g.members, newMemberRecord],
        };
      })
    );

    triggerNotification(`You joined "${groupToJoin.name}" for Slot #${chosenSlot}!`);
  };

  // Admin Payout Disbursement Handler
  const handleDisburseRoundPayout = (
    group: SavingsGroup,
    beneficiaryName: string,
    potAmount: number
  ) => {
    // If current user is beneficiary, credit their wallet
    const isCurrentUserBeneficiary = group.members.find(
      (m) => m.slotNumber === group.currentRound && m.userId === currentUser.id
    );

    if (isCurrentUserBeneficiary) {
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + potAmount,
        totalEarned: prev.totalEarned + potAmount,
        lockedEscrowBalance: Math.max(0, prev.lockedEscrowBalance - group.contributionAmount),
      }));
    }

    // Advance round in group
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== group.id) return g;
        const nextRound = g.currentRound < g.totalRounds ? g.currentRound + 1 : g.currentRound;
        const nextMember = g.members.find((m) => m.slotNumber === nextRound);

        return {
          ...g,
          currentRound: nextRound,
          currentBeneficiaryId: nextMember?.userId || 'Completed',
          currentBeneficiaryName: nextMember?.fullName || 'Cycle Completed',
          members: g.members.map((m) => {
            if (m.slotNumber === group.currentRound) {
              return { ...m, hasReceivedPayout: true };
            }
            // reset payment for next round
            return { ...m, hasPaidCurrentCycle: false };
          }),
        };
      })
    );

    // Record transaction
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: `TP-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'payout',
      title: `Round ${group.currentRound} Lump-Sum Disbursed`,
      description: `Rotational payout from ${group.name} to ${beneficiaryName}`,
      amount: potAmount,
      date: `${new Date().toLocaleDateString('en-NG')} • Automated Escrow`,
      timestamp: Date.now(),
      status: 'success',
      groupId: group.id,
      groupName: group.name,
      paymentMethod: 'TrustPass Automated Escrow Release',
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Paystack Receipt Upload Handler (Member uploads proof)
  const handleReceiptSubmitted = (newReceipt: ContributionReceipt) => {
    // 1. Add to receipts list
    setReceipts((prev) => [newReceipt, ...prev]);

    // 2. Mark member's receiptStatus in the group as 'pending_verification'
    setGroups((prevGroups) =>
      prevGroups.map((grp) => {
        if (grp.id !== newReceipt.groupId) return grp;
        return {
          ...grp,
          members: grp.members.map((mem) => {
            if (mem.userId === newReceipt.memberId) {
              return {
                ...mem,
                receiptStatus: 'pending_verification',
              };
            }
            return mem;
          }),
        };
      })
    );

    // Sync selectedGroupModal if active
    setSelectedGroupModal((prev) => {
      if (!prev || prev.id !== newReceipt.groupId) return prev;
      return {
        ...prev,
        members: prev.members.map((mem) => {
          if (mem.userId === newReceipt.memberId) {
            return {
              ...mem,
              receiptStatus: 'pending_verification',
            };
          }
          return mem;
        }),
      };
    });

    // 3. Record pending transaction in transaction history
    const nowStr = new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());

    const pendingTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: `TP-RCPT-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'contribution',
      title: 'Paystack Transfer Receipt Uploaded',
      description: `Payment proof submitted for ${newReceipt.groupName} (Round ${newReceipt.roundNumber}) - Sent to Admin for verification`,
      amount: newReceipt.amount,
      date: `${nowStr} WAT`,
      timestamp: Date.now(),
      status: 'pending',
      groupId: newReceipt.groupId,
      groupName: newReceipt.groupName,
      paymentMethod: `Direct Transfer (${newReceipt.senderBankName}) -> Paystack Account`,
    };

    setTransactions((prev) => [pendingTx, ...prev]);

    triggerNotification(`Receipt uploaded! Sent to Admin for automated verification.`);
  };

  // Admin Receipt Verification Handler
  const handleApproveReceipt = (receiptId: string) => {
    const rcpt = receipts.find((r) => r.id === receiptId);
    if (!rcpt) return;

    const nowFormatted = new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());

    // 1. Mark receipt as verified
    setReceipts((prev) =>
      prev.map((r) => {
        if (r.id !== receiptId) return r;
        return {
          ...r,
          status: 'verified',
          verifiedAt: `${nowFormatted} WAT`,
        };
      })
    );

    // 2. Mark member in group as paid
    setGroups((prevGroups) =>
      prevGroups.map((grp) => {
        if (grp.id !== rcpt.groupId) return grp;
        return {
          ...grp,
          members: grp.members.map((mem) => {
            if (mem.userId === rcpt.memberId) {
              return {
                ...mem,
                hasPaidCurrentCycle: true,
                receiptStatus: 'verified',
              };
            }
            return mem;
          }),
        };
      })
    );

    // Sync selectedGroupModal
    setSelectedGroupModal((prev) => {
      if (!prev || prev.id !== rcpt.groupId) return prev;
      return {
        ...prev,
        members: prev.members.map((mem) => {
          if (mem.userId === rcpt.memberId) {
            return {
              ...mem,
              hasPaidCurrentCycle: true,
              receiptStatus: 'verified',
            };
          }
          return mem;
        }),
      };
    });

    // 3. If current user is the member, increment locked escrow
    if (rcpt.memberId === currentUser.id) {
      setCurrentUser((prev) => ({
        ...prev,
        lockedEscrowBalance: prev.lockedEscrowBalance + rcpt.amount,
      }));
    }

    // 4. Update transaction status
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.groupId === rcpt.groupId && tx.status === 'pending') {
          return {
            ...tx,
            status: 'escrow',
            title: 'Paystack Transfer Verified by Admin',
            description: `Admin approved contribution receipt for ${rcpt.groupName}`,
          };
        }
        return tx;
      })
    );

    triggerNotification(`Receipt for ${rcpt.memberName} verified! Member marked as Paid.`);
  };

  // Admin Receipt Rejection Handler
  const handleRejectReceipt = (receiptId: string, reason: string) => {
    const rcpt = receipts.find((r) => r.id === receiptId);
    if (!rcpt) return;

    setReceipts((prev) =>
      prev.map((r) => {
        if (r.id !== receiptId) return r;
        return {
          ...r,
          status: 'rejected',
          rejectionReason: reason,
        };
      })
    );

    setGroups((prevGroups) =>
      prevGroups.map((grp) => {
        if (grp.id !== rcpt.groupId) return grp;
        return {
          ...grp,
          members: grp.members.map((mem) => {
            if (mem.userId === rcpt.memberId) {
              return {
                ...mem,
                receiptStatus: 'rejected',
              };
            }
            return mem;
          }),
        };
      })
    );

    setSelectedGroupModal((prev) => {
      if (!prev || prev.id !== rcpt.groupId) return prev;
      return {
        ...prev,
        members: prev.members.map((mem) => {
          if (mem.userId === rcpt.memberId) {
            return {
              ...mem,
              receiptStatus: 'rejected',
            };
          }
          return mem;
        }),
      };
    });

    triggerNotification(`Receipt rejected for ${rcpt.memberName}. Reason: ${reason}`);
  };

  // If not authenticated, show two-pane portal authentication view
  if (!isAuthenticated) {
    return <AuthTwoPane onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Top Notification Toast */}
      {alertNotification && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{alertNotification}</span>
        </div>
      )}

      {/* Main App Navbar */}
      <Navbar
        user={currentUser}
        onSignOut={handleSignOut}
        onOpenFundModal={() => setPaymentModalConfig({ isOpen: true, type: 'fund' })}
        onOpenWithdrawModal={() => setPaymentModalConfig({ isOpen: true, type: 'withdraw' })}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={currentUser}
            groups={groups}
            transactions={transactions}
            receipts={receipts}
            onOpenFundModal={() => setPaymentModalConfig({ isOpen: true, type: 'fund' })}
            onOpenWithdrawModal={() => setPaymentModalConfig({ isOpen: true, type: 'withdraw' })}
            onPayRound={(group) => {
              setPaymentModalConfig({
                isOpen: true,
                type: 'contribute',
                groupContext: {
                  id: group.id,
                  name: group.name,
                  amount: group.contributionAmount,
                  round: group.currentRound,
                  paystackAccountNumber: group.paystackAccountNumber,
                  paystackAccountName: group.paystackAccountName,
                  paystackBankName: group.paystackBankName,
                },
              });
            }}
            onOpenUploadReceipt={(group) => setUploadReceiptGroup(group)}
            onViewGroupDetails={(group) => setSelectedGroupModal(group)}
            onViewReceipt={(tx) => setSelectedReceipt(tx)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreLearnMore
            onNavigateToCreate={() => setActiveTab('create_group')}
            onNavigateToJoin={() => setActiveTab('join_group')}
          />
        )}

        {activeTab === 'create_group' && (
          <CreateGroupView
            currentUser={currentUser}
            onGroupCreated={handleGroupCreated}
            onViewCreatedGroup={(groupId) => {
              const created = groups.find((g) => g.id === groupId);
              if (created) setSelectedGroupModal(created);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'join_group' && (
          <JoinGroupView
            currentUser={currentUser}
            groups={groups}
            onJoinGroup={handleJoinGroup}
            onViewDetails={(grp) => setSelectedGroupModal(grp)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 TrustPass Technologies Ltd. Digital Ajo & Cooperative Escrow Platform.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>CAC Registered</span>
            <span>•</span>
            <span>CBN-Aligned Escrow Framework</span>
            <span>•</span>
            <span>NDPR Certified</span>
          </div>
        </div>
      </footer>

      {/* Payment Processing Modal (Fund, Withdraw, or Contribute) */}
      <PaymentModal
        isOpen={paymentModalConfig.isOpen}
        onClose={() => setPaymentModalConfig((prev) => ({ ...prev, isOpen: false }))}
        type={paymentModalConfig.type}
        user={currentUser}
        groupContext={paymentModalConfig.groupContext}
        onSuccess={handlePaymentSuccess}
        onOpenUploadReceipt={(groupId) => {
          const grp = groups.find((g) => g.id === groupId);
          if (grp) setUploadReceiptGroup(grp);
        }}
      />

      {/* Transaction Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Group Detail & Rotational Schedule Modal */}
      <GroupDetailModal
        group={selectedGroupModal}
        currentUser={currentUser}
        onClose={() => setSelectedGroupModal(null)}
        onPayRound={(group) => {
          setPaymentModalConfig({
            isOpen: true,
            type: 'contribute',
            groupContext: {
              id: group.id,
              name: group.name,
              amount: group.contributionAmount,
              round: group.currentRound,
              paystackAccountNumber: group.paystackAccountNumber,
              paystackAccountName: group.paystackAccountName,
              paystackBankName: group.paystackBankName,
            },
          });
        }}
        onDisburseRoundPayout={handleDisburseRoundPayout}
        onNudgeMember={(memberName) => {
          triggerNotification(`Sent SMS & WhatsApp payment reminder to ${memberName}.`);
        }}
        receipts={receipts}
        onOpenUploadReceipt={(grp) => setUploadReceiptGroup(grp)}
        onApproveReceipt={handleApproveReceipt}
        onRejectReceipt={handleRejectReceipt}
      />

      {/* Dedicated Upload Paystack Transfer Receipt Modal */}
      {uploadReceiptGroup && (
        <UploadReceiptModal
          isOpen={Boolean(uploadReceiptGroup)}
          group={uploadReceiptGroup}
          currentUser={currentUser}
          onClose={() => setUploadReceiptGroup(null)}
          onSubmitReceipt={handleReceiptSubmitted}
        />
      )}

    </div>
  );
}
