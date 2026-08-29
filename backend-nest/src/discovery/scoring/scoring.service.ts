import { Injectable } from '@nestjs/common';
import { ScoreBreakdown } from '../value-objects/score-breakdown.vo';

/**
 * Single source of truth for confidence_total (PRODUCT_SPEC.md, "Scoring
 * logic v1, rule-based — not ML"). Receptiveness is weighted highest: a
 * high-reach, low-receptiveness channel wastes the attempt and can burn the
 * account/community relationship, which costs more than a missed high-reach
 * opportunity.
 */
@Injectable()
export class ScoringService {
  computeConfidence(scores: ScoreBreakdown): number {
    const total =
      scores.reach * 0.3 + scores.receptiveness * 0.4 + scores.warmth * 0.3;
    return Math.round(total * 100) / 100;
  }
}
