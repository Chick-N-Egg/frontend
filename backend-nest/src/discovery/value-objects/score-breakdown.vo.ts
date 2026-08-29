/**
 * Pure value object — no NestJS/DB/HTTP dependencies. Mirrors RelevanceScore
 * from docs/launchmap-domain-model.mmd, but carries the three PRODUCT_SPEC.md
 * axes instead of a single relevance value.
 */
export class ScoreBreakdown {
  constructor(
    public readonly reach: number,
    public readonly receptiveness: number,
    public readonly warmth: number,
  ) {
    for (const [label, value] of [
      ['reach', reach],
      ['receptiveness', receptiveness],
      ['warmth', warmth],
    ] as const) {
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error(`${label}_score must be an integer between 1 and 5, got ${value}`);
      }
    }
  }
}
