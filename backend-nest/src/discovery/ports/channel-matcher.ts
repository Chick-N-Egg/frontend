import { BriefEntity } from '../../brief/entities/brief.entity';
import { ChannelCandidateEntity } from '../../channel-catalog/entities/channel-candidate.entity';
import { ScoreBreakdown } from '../value-objects/score-breakdown.vo';
import { ResultSource } from '../enums/result-source.enum';

export interface ScoredCandidate {
  name: string;
  channelType: ChannelCandidateEntity['channelType'];
  url: string | null;
  whyItFits: string;
  scores: ScoreBreakdown;
  source: ResultSource;
}

/**
 * Equivalent of CommunityMatcher in docs/launchmap-domain-model.mmd. The
 * "catalog" argument mirrors match(startup, catalog) from that diagram.
 */
export interface ChannelMatcher {
  match(
    brief: BriefEntity,
    catalog: ChannelCandidateEntity[],
  ): Promise<ScoredCandidate[]>;
}

export const CHANNEL_MATCHER = Symbol('CHANNEL_MATCHER');
