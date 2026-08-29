import { ChannelType } from '../../discovery/enums/channel-type.enum';
import { AttemptOutcome } from '../../attempt/enums/attempt-outcome.enum';

// Plain classes (not interfaces) so @nestjs/swagger's CLI plugin can
// introspect them at runtime — interfaces are erased and produce no schema.

export class DailyGrowthPoint {
  date: string;
  signups: number;
  revenue: number;
}

export class FunnelStage {
  stage: 'attempts' | 'interested' | 'signed_up' | 'paying';
  count: number;
}

export class ChannelPerformance {
  channelType: ChannelType;
  attempts: number;
  responseRate: number;
  signups: number;
  revenue: number;
}

export class RecentAttempt {
  id: string;
  resultId: string;
  channelType: ChannelType;
  outcome: AttemptOutcome;
  loggedAt: Date;
}

export class DashboardResponseDto {
  totalAttempts: number;
  responseRate: number;
  signUps: number;
  revenue: number;
  growthOverTime: DailyGrowthPoint[];
  funnel: FunnelStage[];
  performanceByChannel: ChannelPerformance[];
  recentAttempts: RecentAttempt[];
  /** null until 3+ attempts are logged (PRODUCT_SPEC.md AC). */
  refinementInsight: string | null;
}
