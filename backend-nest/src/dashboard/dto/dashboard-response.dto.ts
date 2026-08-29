import { ChannelType } from '../../discovery/enums/channel-type.enum';
import { AttemptOutcome } from '../../attempt/enums/attempt-outcome.enum';

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
  loggedAt: Date;
}

export interface DashboardResponseDto {
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
