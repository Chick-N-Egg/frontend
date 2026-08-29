import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OPENAI_CLIENT } from '../../openai/openai.provider';
import { Stage } from '../enums/stage.enum';

export interface BriefExtraction {
  productSummary: string;
  audienceSegments: string[];
  stage: Stage;
  clarifyingQuestion: string | null;
}

/**
 * Replaces the "Fastino" text-to-JSON intake service referenced in the
 * hackathon tech-arch doc, which has no real credentials/SDK in this repo.
 * Same pattern as backend/main.py: a single OpenAI call constrained to JSON.
 */
@Injectable()
export class BriefExtractor {
  constructor(@Inject(OPENAI_CLIENT) private readonly openai: OpenAI) {}

  async extract(rawInput: string): Promise<BriefExtraction> {
    const prompt = `You are a GTM analyst helping an early-stage founder clarify their idea.
The founder wrote the following, in plain language, possibly rambling:

"""
${rawInput}
"""

Extract a structured brief. Return strict JSON with this exact shape:
{
  "product_summary": "<one or two sentence summary of what the product does>",
  "audience_segments": ["<short audience segment phrase>", "..."],
  "stage": "<one of: idea, mvp, early-traction>",
  "extraction_confidence": <float 0-1>,
  "clarifying_question": "<one sharpening follow-up question, or null if extraction_confidence >= 0.6>"
}
Pick 1-4 audience_segments, most specific first. Only include a clarifying_question when extraction_confidence < 0.6.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(response.choices[0].message.content ?? '{}');
    const stage = Object.values(Stage).includes(parsed.stage)
      ? (parsed.stage as Stage)
      : Stage.IDEA;

    return {
      productSummary: parsed.product_summary ?? '',
      audienceSegments: Array.isArray(parsed.audience_segments)
        ? parsed.audience_segments
        : [],
      stage,
      clarifyingQuestion: parsed.clarifying_question ?? null,
    };
  }
}
