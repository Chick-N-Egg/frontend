import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BriefEntity } from './entities/brief.entity';
import { BRIEF_REPOSITORY, BriefRepository } from './ports/brief.repository';
import { BriefExtractor } from './ai/brief-extractor';
import { UpdateBriefDto } from './dto/update-brief.dto';

@Injectable()
export class BriefService {
  constructor(
    @Inject(BRIEF_REPOSITORY) private readonly briefs: BriefRepository,
    private readonly extractor: BriefExtractor,
  ) {}

  async create(rawInput: string): Promise<{
    brief: BriefEntity;
    clarifyingQuestion: string | null;
  }> {
    const extraction = await this.extractor.extract(rawInput);

    const brief = new BriefEntity();
    brief.rawInput = rawInput;
    brief.productSummary = extraction.productSummary;
    brief.audienceSegments = extraction.audienceSegments;
    brief.stage = extraction.stage;

    const saved = await this.briefs.save(brief);
    return { brief: saved, clarifyingQuestion: extraction.clarifyingQuestion };
  }

  async findById(id: string): Promise<BriefEntity> {
    const brief = await this.briefs.findById(id);
    if (!brief) throw new NotFoundException(`Brief ${id} not found`);
    return brief;
  }

  async update(id: string, dto: UpdateBriefDto): Promise<BriefEntity> {
    const brief = await this.findById(id);
    if (dto.productSummary !== undefined) brief.productSummary = dto.productSummary;
    if (dto.audienceSegments !== undefined) brief.audienceSegments = dto.audienceSegments;
    if (dto.stage !== undefined) brief.stage = dto.stage;
    return this.briefs.save(brief);
  }
}
