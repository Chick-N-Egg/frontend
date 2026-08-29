import { Inject, Injectable } from '@nestjs/common';
import { ATTEMPT_REPOSITORY, AttemptRepository } from '../attempt/ports/attempt.repository';
import { AttemptEntity } from '../attempt/entities/attempt.entity';
import { AttemptOutcome } from '../attempt/enums/attempt-outcome.enum';
import { ChannelType } from '../discovery/enums/channel-type.enum';
import {
  ChannelPerformance,
  DashboardResponseDto,
  DailyGrowthPoint,
  FunnelStage,
  RecentAttempt,
} from './dto/dashboard-response.dto';

const REFINEMENT_MIN_ATTEMPTS = 3;
const CONVERTED_OUTCOMES = new Set([AttemptOutcome.SIGNED_UP, AttemptOutcome.PAYING]);
const RESPONDED_OUTCOMES = new Set([
  AttemptOutcome.INTERESTED,
  AttemptOutcome.SIGNED_UP,
  AttemptOutcome.PAYING,
]);

@Injectable()
export class DashboardService {
  constructor(
    @Inject(ATTEMPT_REPOSITORY) private readonly attempts: AttemptRepository,
  ) {}

  async build(): Promise<DashboardResponseDto> {
    const attempts = await this.attempts.findAll();
    return DashboardService.compute(attempts);
  }

  /** Pure — takes attempts (with `result` relation loaded), returns the full dashboard payload. */
  static compute(attempts: AttemptEntity[]): DashboardResponseDto {
    const totalAttempts = attempts.length;
    const responded = attempts.filter((a) => RESPONDED_OUTCOMES.has(a.outcome)).length;
    const signUps = attempts.filter((a) => CONVERTED_OUTCOMES.has(a.outcome)).length;
    const revenue = attempts
      .filter((a) => a.outcome === AttemptOutcome.PAYING)
      .reduce((sum, a) => sum + Number(a.revenue ?? 0), 0);

    return {
      totalAttempts,
      responseRate: totalAttempts > 0 ? round(responded / totalAttempts) : 0,
      signUps,
      revenue,
      growthOverTime: buildGrowthOverTime(attempts),
      funnel: buildFunnel(attempts),
      performanceByChannel: buildChannelPerformance(attempts),
      recentAttempts: buildRecentAttempts(attempts),
      refinementInsight:
        totalAttempts >= REFINEMENT_MIN_ATTEMPTS ? buildRefinementInsight(attempts) : null,
    };
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildGrowthOverTime(attempts: AttemptEntity[]): DailyGrowthPoint[] {
  const byDate = new Map<string, DailyGrowthPoint>();
  for (const attempt of attempts) {
    const date = attempt.loggedAt.toISOString().slice(0, 10);
    const point = byDate.get(date) ?? { date, signups: 0, revenue: 0 };
    if (CONVERTED_OUTCOMES.has(attempt.outcome)) point.signups += 1;
    if (attempt.outcome === AttemptOutcome.PAYING) point.revenue += Number(attempt.revenue ?? 0);
    byDate.set(date, point);
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function buildFunnel(attempts: AttemptEntity[]): FunnelStage[] {
  const interested = attempts.filter((a) => RESPONDED_OUTCOMES.has(a.outcome)).length;
  const signedUp = attempts.filter((a) => CONVERTED_OUTCOMES.has(a.outcome)).length;
  const paying = attempts.filter((a) => a.outcome === AttemptOutcome.PAYING).length;

  return [
    { stage: 'attempts', count: attempts.length },
    { stage: 'interested', count: interested },
    { stage: 'signed_up', count: signedUp },
    { stage: 'paying', count: paying },
  ];
}

function buildChannelPerformance(attempts: AttemptEntity[]): ChannelPerformance[] {
  const byChannel = new Map<ChannelType, AttemptEntity[]>();
  for (const attempt of attempts) {
    const channelType = attempt.result?.channelType;
    if (!channelType) continue;
    const bucket = byChannel.get(channelType) ?? [];
    bucket.push(attempt);
    byChannel.set(channelType, bucket);
  }

  return [...byChannel.entries()].map(([channelType, bucket]) => {
    const responded = bucket.filter((a) => RESPONDED_OUTCOMES.has(a.outcome)).length;
    const signups = bucket.filter((a) => CONVERTED_OUTCOMES.has(a.outcome)).length;
    const revenue = bucket
      .filter((a) => a.outcome === AttemptOutcome.PAYING)
      .reduce((sum, a) => sum + Number(a.revenue ?? 0), 0);
    return {
      channelType,
      attempts: bucket.length,
      responseRate: round(responded / bucket.length),
      signups,
      revenue,
    };
  });
}

function buildRecentAttempts(attempts: AttemptEntity[]): RecentAttempt[] {
  return attempts.slice(0, 20).map((a) => ({
    id: a.id,
    resultId: a.resultId,
    channelType: a.result?.channelType,
    outcome: a.outcome,
    loggedAt: a.loggedAt,
  }));
}

/**
 * Rule-based (v1, not ML) — same philosophy as ScoringService. Compares
 * conversion rate of the best- vs worst-performing channel type, in plain
 * language, per PRODUCT_SPEC.md's example: "communities are converting at
 * X% vs Y% for cold email". PRODUCT_SPEC.md's AC only requires 3+ total
 * logged attempts (checked by the caller) — no per-channel minimum.
 */
function buildRefinementInsight(attempts: AttemptEntity[]): string | null {
  const performance = buildChannelPerformance(attempts);
  if (performance.length < 2) return null;

  const sorted = [...performance].sort(
    (a, b) => b.signups / b.attempts - a.signups / a.attempts,
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const bestRate = Math.round((best.signups / best.attempts) * 100);
  const worstRate = Math.round((worst.signups / worst.attempts) * 100);

  if (bestRate === worstRate) return null;

  return `${best.channelType} is converting at ${bestRate}% vs ${worstRate}% for ${worst.channelType} — future suggestions are weighted toward ${best.channelType}.`;
}
