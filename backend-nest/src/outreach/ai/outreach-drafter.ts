import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OPENAI_CLIENT } from '../../openai/openai.provider';
import { BriefEntity } from '../../brief/entities/brief.entity';
import { ResultEntity } from '../../discovery/entities/result.entity';

export interface OutreachDraft {
  suggestedApproach: string;
  draftMessage: string;
}

/**
 * Replaces the fictitious "Fastino" content-generation service. Same
 * value-first, never-pitch-in-the-first-post constraint as PRODUCT_SPEC.md
 * step 4, and the same OpenAI JSON-mode pattern backend/main.py already uses
 * for /generate-playbook.
 */
@Injectable()
export class OutreachDrafter {
  constructor(@Inject(OPENAI_CLIENT) private readonly openai: OpenAI) {}

  async draft(brief: BriefEntity, result: ResultEntity): Promise<OutreachDraft> {
    const prompt = `You are a community growth expert. Recommend the right first move for a
founder entering a specific channel to find early customers, and draft a
ready-to-edit message. Value-first — never pitch the product directly in
the first message.

Brief:
- Product summary: ${brief.productSummary}
- Audience segments: ${brief.audienceSegments.join(', ')}
- Stage: ${brief.stage}

Channel: ${result.name} (${result.channelType})
Why it fits: ${result.whyItFits}

Return strict JSON with this exact shape:
{
  "suggested_approach": "<one short sentence: e.g. 'comment first on relevant threads' vs 'direct DM' vs 'open post'>",
  "draft_message": "<full copy-paste-ready message matching that approach and the channel's norms>"
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(response.choices[0].message.content ?? '{}');
    return {
      suggestedApproach: parsed.suggested_approach ?? '',
      draftMessage: parsed.draft_message ?? '',
    };
  }
}
