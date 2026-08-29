import { Inject, Injectable } from '@nestjs/common';
import { BriefService } from '../brief/brief.service';
import { ChannelCatalogService } from '../channel-catalog/channel-catalog.service';
import { ResultEntity } from './entities/result.entity';
import { RESULT_REPOSITORY, ResultRepository } from './ports/result.repository';
import { CHANNEL_MATCHER, ChannelMatcher } from './ports/channel-matcher';
import { ScoringService } from './scoring/scoring.service';
import { ResultResponseDto } from './dto/result-response.dto';

@Injectable()
export class DiscoveryService {
  constructor(
    private readonly briefService: BriefService,
    private readonly catalog: ChannelCatalogService,
    @Inject(CHANNEL_MATCHER) private readonly matcher: ChannelMatcher,
    @Inject(RESULT_REPOSITORY) private readonly results: ResultRepository,
    private readonly scoring: ScoringService,
  ) {}

  async discover(briefId: string): Promise<ResultResponseDto[]> {
    const brief = await this.briefService.findById(briefId);
    const candidates = await this.catalog.findByAudienceSegments(brief.audienceSegments);
    const scored = await this.matcher.match(brief, candidates);

    const entities = scored.map((candidate) => {
      const result = new ResultEntity();
      result.briefId = brief.id;
      result.channelType = candidate.channelType;
      result.name = candidate.name;
      result.url = candidate.url;
      result.whyItFits = candidate.whyItFits;
      result.reachScore = candidate.scores.reach;
      result.receptivenessScore = candidate.scores.receptiveness;
      result.warmthScore = candidate.scores.warmth;
      result.confidenceTotal = this.scoring.computeConfidence(candidate.scores);
      result.source = candidate.source;
      return result;
    });

    const saved = await this.results.saveMany(entities);
    return this.toRankedResponse(saved);
  }

  async findByBriefId(briefId: string): Promise<ResultResponseDto[]> {
    const results = await this.results.findByBriefId(briefId);
    return this.toRankedResponse(results);
  }

  private toRankedResponse(results: ResultEntity[]): ResultResponseDto[] {
    const sorted = [...results].sort((a, b) => b.confidenceTotal - a.confidenceTotal);
    const topConfidence = sorted[0]?.confidenceTotal;
    return sorted.map((r) => ResultResponseDto.from(r, topConfidence));
  }
}
