export type Stage = 'idea' | 'mvp' | 'early-traction';

export interface Brief {
  id: string;
  rawInput: string;
  productSummary: string;
  audienceSegments: string[];
  stage: Stage;
  createdAt: string;
}

// Only POST /briefs adds this field ({ ...brief, clarifyingQuestion }); it is
// not persisted, so GET/PATCH /briefs/:id return a plain Brief without it.
export interface BriefCreationResponse extends Brief {
  clarifyingQuestion: string | null;
}

export interface UpdateBriefPayload {
  productSummary?: string;
  audienceSegments?: string[];
  stage?: Stage;
}

export type ChannelType =
  | 'discord'
  | 'reddit'
  | 'facebook_group'
  | 'slack'
  | 'linkedin'
  | 'twitter'
  | 'newsletter'
  | 'meetup'
  | 'forum'
  | 'company'
  | 'individual';

export type ResultSource = 'verified_data' | 'web_search' | 'manual';

export interface Result {
  id: string;
  briefId: string;
  channelType: ChannelType;
  name: string;
  url: string | null;
  whyItFits: string;
  reachScore: number;
  receptivenessScore: number;
  warmthScore: number;
  confidenceTotal: number;
  source: ResultSource;
  suggestedApproach: string | null;
  draftMessage: string | null;
  createdAt: string;
  isBestShot: boolean;
}

export type AttemptOutcome = 'no_response' | 'declined' | 'interested' | 'signed_up' | 'paying';

export interface LogAttemptPayload {
  messageSent: string;
  outcome: AttemptOutcome;
  revenue?: number;
  notes?: string;
}

export interface Attempt {
  id: string;
  resultId: string;
  messageSent: string;
  outcome: AttemptOutcome;
  revenue: number | null;
  notes: string | null;
  loggedAt: string;
}

export interface DailyGrowthPoint {
  date: string;
  signups: number;
  revenue: number;
}

export interface FunnelStage {
  stage: 'attempts' | 'interested' | 'signed_up' | 'paying';
  count: number;
}

export interface ChannelPerformance {
  channelType: ChannelType;
  attempts: number;
  responseRate: number;
  signups: number;
  revenue: number;
}

export interface RecentAttempt {
  id: string;
  resultId: string;
  channelType: ChannelType;
  outcome: AttemptOutcome;
  loggedAt: string;
}

export interface DashboardResponse {
  totalAttempts: number;
  responseRate: number;
  signUps: number;
  revenue: number;
  growthOverTime: DailyGrowthPoint[];
  funnel: FunnelStage[];
  performanceByChannel: ChannelPerformance[];
  recentAttempts: RecentAttempt[];
  refinementInsight: string | null;
}
