export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bvn: string;
  avatarUrl?: string;
  accountNumber: string;
  bankName: string;
  walletBalance: number;
  lockedEscrowBalance: number;
  totalSaved: number;
  totalEarned: number;
  transactionPin: string;
}

export type ContributionFrequency = 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';

export type PayoutRule = 'First-come sequence' | 'Admin scheduled' | 'Random balloting' | 'Bidding system';

export interface GroupMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  slotNumber: number;
  hasPaidCurrentCycle: boolean;
  hasReceivedPayout: boolean;
  payoutDate: string;
  isCurrentUser?: boolean;
  receiptStatus?: 'none' | 'pending_verification' | 'verified' | 'rejected';
  receiptId?: string;
}

export interface ContributionReceipt {
  id: string;
  groupId: string;
  groupName: string;
  roundNumber: number;
  memberId: string;
  memberName: string;
  memberEmail?: string;
  memberPhone?: string;
  amount: number;
  receiptFileName: string;
  receiptFileUrl?: string;
  senderAccountName: string;
  senderBankName: string;
  uploadedAt: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface SavingsGroup {
  id: string;
  uid: string; // e.g., 'TP-AJO-4821M'
  name: string;
  description: string;
  category: 'Business' | 'Rent & Housing' | 'Personal Savings' | 'Tech & Equipment' | 'Emergency Thrift';
  contributionAmount: number; // in Naira
  frequency: ContributionFrequency;
  maxMembers: number;
  currentMembersCount: number;
  totalPotSize: number; // contributionAmount * maxMembers
  adminId: string;
  adminName: string;
  adminEmail: string;
  paystackAccountNumber: string;
  paystackAccountName: string;
  paystackBankName: string;
  payoutRule: PayoutRule;
  isPrivate: boolean;
  status: 'active' | 'recruiting' | 'completed';
  startDate: string;
  currentRound: number;
  totalRounds: number;
  nextPayoutDate: string;
  currentBeneficiaryId: string;
  currentBeneficiaryName: string;
  members: GroupMember[];
  allowAdminParticipation: boolean;
  lateFee: number;
}

export type TransactionType = 'deposit' | 'contribution' | 'payout' | 'withdrawal';

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  date: string;
  timestamp: number;
  status: 'success' | 'escrow' | 'pending' | 'failed';
  groupId?: string;
  groupName?: string;
  paymentMethod: string;
}
