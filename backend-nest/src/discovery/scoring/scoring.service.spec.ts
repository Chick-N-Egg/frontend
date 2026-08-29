import { ScoringService } from './scoring.service';
import { ScoreBreakdown } from '../value-objects/score-breakdown.vo';

describe('ScoringService', () => {
  const scoring = new ScoringService();

  it('computes confidence_total per PRODUCT_SPEC.md weights (0.3/0.4/0.3)', () => {
    const scores = new ScoreBreakdown(5, 5, 5);
    expect(scoring.computeConfidence(scores)).toBe(5);
  });

  it('weighs receptiveness highest', () => {
    const highReceptiveness = new ScoreBreakdown(1, 5, 1);
    const highReach = new ScoreBreakdown(5, 1, 1);
    expect(scoring.computeConfidence(highReceptiveness)).toBeGreaterThan(
      scoring.computeConfidence(highReach),
    );
  });

  it('matches the documented formula exactly', () => {
    const scores = new ScoreBreakdown(4, 2, 3);
    const expected = 4 * 0.3 + 2 * 0.4 + 3 * 0.3;
    expect(scoring.computeConfidence(scores)).toBeCloseTo(expected, 2);
  });

  it('rejects out-of-range scores', () => {
    expect(() => new ScoreBreakdown(0, 3, 3)).toThrow();
    expect(() => new ScoreBreakdown(6, 3, 3)).toThrow();
    expect(() => new ScoreBreakdown(3.5, 3, 3)).toThrow();
  });
});
