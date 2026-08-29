import { DashboardService } from './dashboard.service';
import { AttemptEntity } from '../attempt/entities/attempt.entity';
import { AttemptOutcome } from '../attempt/enums/attempt-outcome.enum';
import { ChannelType } from '../discovery/enums/channel-type.enum';
import { ResultEntity } from '../discovery/entities/result.entity';

function makeAttempt(
  outcome: AttemptOutcome,
  channelType: ChannelType,
  overrides: Partial<AttemptEntity> = {},
): AttemptEntity {
  const attempt = new AttemptEntity();
  attempt.id = overrides.id ?? Math.random().toString(36);
  attempt.resultId = 'result-1';
  attempt.messageSent = 'hi';
  attempt.outcome = outcome;
  attempt.revenue = overrides.revenue ?? null;
  attempt.notes = null;
  attempt.loggedAt = overrides.loggedAt ?? new Date('2026-01-01T00:00:00Z');
  attempt.result = { channelType } as ResultEntity;
  return attempt;
}

describe('DashboardService.compute', () => {
  it('returns zeroed metrics and null refinement_insight for no attempts', () => {
    const dashboard = DashboardService.compute([]);
    expect(dashboard.totalAttempts).toBe(0);
    expect(dashboard.responseRate).toBe(0);
    expect(dashboard.refinementInsight).toBeNull();
  });

  it('computes KPIs and funnel from a mix of outcomes', () => {
    const attempts = [
      makeAttempt(AttemptOutcome.NO_RESPONSE, ChannelType.REDDIT),
      makeAttempt(AttemptOutcome.INTERESTED, ChannelType.REDDIT),
      makeAttempt(AttemptOutcome.SIGNED_UP, ChannelType.DISCORD),
      makeAttempt(AttemptOutcome.PAYING, ChannelType.DISCORD, { revenue: 100 }),
    ];

    const dashboard = DashboardService.compute(attempts);

    expect(dashboard.totalAttempts).toBe(4);
    expect(dashboard.responseRate).toBe(0.75); // 3 of 4 responded
    expect(dashboard.signUps).toBe(2); // signed_up + paying
    expect(dashboard.revenue).toBe(100);
    expect(dashboard.funnel).toEqual([
      { stage: 'attempts', count: 4 },
      { stage: 'interested', count: 3 },
      { stage: 'signed_up', count: 2 },
      { stage: 'paying', count: 1 },
    ]);
  });

  it('requires at least 3 logged attempts before generating a refinement_insight (PRODUCT_SPEC.md AC)', () => {
    const twoAttempts = [
      makeAttempt(AttemptOutcome.SIGNED_UP, ChannelType.DISCORD),
      makeAttempt(AttemptOutcome.NO_RESPONSE, ChannelType.REDDIT),
    ];
    expect(DashboardService.compute(twoAttempts).refinementInsight).toBeNull();

    const threeAttempts = [
      ...twoAttempts,
      makeAttempt(AttemptOutcome.SIGNED_UP, ChannelType.DISCORD),
    ];
    const dashboard = DashboardService.compute(threeAttempts);
    expect(dashboard.refinementInsight).not.toBeNull();
    expect(dashboard.refinementInsight).toContain('discord');
  });

  it('breaks down performance by channel type', () => {
    const attempts = [
      makeAttempt(AttemptOutcome.SIGNED_UP, ChannelType.DISCORD),
      makeAttempt(AttemptOutcome.NO_RESPONSE, ChannelType.DISCORD),
      makeAttempt(AttemptOutcome.NO_RESPONSE, ChannelType.REDDIT),
    ];
    const dashboard = DashboardService.compute(attempts);
    const discord = dashboard.performanceByChannel.find((p) => p.channelType === ChannelType.DISCORD);
    const reddit = dashboard.performanceByChannel.find((p) => p.channelType === ChannelType.REDDIT);

    expect(discord).toMatchObject({ attempts: 2, signups: 1 });
    expect(reddit).toMatchObject({ attempts: 1, signups: 0 });
  });
});
