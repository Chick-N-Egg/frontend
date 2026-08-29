import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OPENAI_CLIENT } from '../../openai/openai.provider';
import { BriefEntity } from '../../brief/entities/brief.entity';
import { ChannelCandidateEntity } from '../../channel-catalog/entities/channel-candidate.entity';
import { ChannelMatcher, ScoredCandidate } from '../ports/channel-matcher';
import { ScoreBreakdown } from '../value-objects/score-breakdown.vo';
import { ResultSource } from '../enums/result-source.enum';

/**
 * Replaces the fictitious "Cala" verified-data search service from the
 * hackathon tech-arch doc (no real credentials/SDK exist for it). Uses the
 * same OpenAI ranking pattern as backend/main.py's /find-communities, but
 * scores each candidate on the three PRODUCT_SPEC.md axes instead of a
 * single relevance_score.
 */
@Injectable()
export class OpenAiChannelMatcher implements ChannelMatcher {
  constructor(@Inject(OPENAI_CLIENT) private readonly openai: OpenAI) {}

  async match(
    brief: BriefEntity,
    catalog: ChannelCandidateEntity[],
  ): Promise<ScoredCandidate[]> {
    const catalogForPrompt = catalog.map((c) => ({
      id: c.externalId,
      name: c.name,
      platform: c.channelType,
      size: c.size,
      tags: c.tags,
      categories: c.categories,
      engagement: c.engagement,
    }));

    const prompt = `You are a GTM strategist scoring communities for a pre-launch founder.

Brief:
- Product summary: ${brief.productSummary}
- Audience segments: ${brief.audienceSegments.join(', ')}
- Stage: ${brief.stage}

Community catalog (JSON array):
${JSON.stringify(catalogForPrompt)}

Score every community that is plausibly relevant (skip clearly irrelevant ones).
For each, score three axes 1-5:
- reach_score: how many relevant people are actually there
- receptiveness_score: will this space welcome outreach, or penalize/ban it (self-promo rules, mod culture)
- warmth_score: cold list (1) vs some existing foothold/context (5) — assume cold (1-2) unless the brief implies otherwise

Return strict JSON with this exact shape:
{
  "results": [
    {
      "id": "<id from catalog>",
      "why_it_fits": "<one-line reasoning tied to the audience segments>",
      "reach_score": <int 1-5>,
      "receptiveness_score": <int 1-5>,
      "warmth_score": <int 1-5>
    }
  ]
}
Return between 5 and 15 results, best matches first.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(response.choices[0].message.content ?? '{}') as {
      results?: Array<{
        id: string;
        why_it_fits: string;
        reach_score: number;
        receptiveness_score: number;
        warmth_score: number;
      }>;
    };

    const byId = new Map(catalog.map((c) => [c.externalId, c]));

    return (parsed.results ?? [])
      .filter((r) => byId.has(r.id))
      .map((r) => {
        const candidate = byId.get(r.id)!;
        return {
          name: candidate.name,
          channelType: candidate.channelType,
          url: candidate.url,
          whyItFits: r.why_it_fits,
          scores: new ScoreBreakdown(r.reach_score, r.receptiveness_score, r.warmth_score),
          source: ResultSource.VERIFIED_DATA,
        };
      });
  }
}
