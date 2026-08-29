import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelCandidateEntity } from './entities/channel-candidate.entity';

@Injectable()
export class ChannelCatalogService {
  constructor(
    @InjectRepository(ChannelCandidateEntity)
    private readonly repo: Repository<ChannelCandidateEntity>,
  ) {}

  findAll(): Promise<ChannelCandidateEntity[]> {
    return this.repo.find();
  }

  async findByAudienceSegments(
    audienceSegments: string[],
  ): Promise<ChannelCandidateEntity[]> {
    const all = await this.repo.find();
    if (audienceSegments.length === 0) return all;

    const needles = audienceSegments.map((s) => s.toLowerCase());
    const scored = all.filter((candidate) => {
      const haystack = [
        candidate.name,
        ...candidate.tags,
        ...candidate.categories,
      ]
        .join(' ')
        .toLowerCase();
      return needles.some((needle) =>
        needle.split(/\s+/).some((word) => word.length > 2 && haystack.includes(word)),
      );
    });

    // Fall back to the full catalog if the keyword pre-filter is too narrow —
    // the AI matcher still applies real relevance scoring on top of this.
    return scored.length > 0 ? scored : all;
  }
}
