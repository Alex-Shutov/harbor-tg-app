export type ReferralStatus = 'REJECTED' | 'UNDER_REVIEW' | 'ACCRUED';

export interface IReferralInfo {
  imageUrl?: string;
  username: string;
  joinedAt: string; // ISO date-time string
  status: ReferralStatus;
}

export interface IReferralSystemInfo {
  isActive: boolean;
  rewardAmount: number;
  earnedAmount: number;
  userHash: string;
  invitedCount: number;
  referrals: IReferralInfo[];
}


