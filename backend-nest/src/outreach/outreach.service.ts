import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BriefService } from '../brief/brief.service';
import { RESULT_REPOSITORY, ResultRepository } from '../discovery/ports/result.repository';
import { OutreachDrafter } from './ai/outreach-drafter';
import { ResultEntity } from '../discovery/entities/result.entity';

@Injectable()
export class OutreachService {
  constructor(
    @Inject(RESULT_REPOSITORY) private readonly results: ResultRepository,
    private readonly briefService: BriefService,
    private readonly drafter: OutreachDrafter,
  ) {}

  async generate(resultId: string): Promise<ResultEntity> {
    const result = await this.results.findById(resultId);
    if (!result) throw new NotFoundException(`Result ${resultId} not found`);

    const brief = await this.briefService.findById(result.briefId);
    const draft = await this.drafter.draft(brief, result);

    result.suggestedApproach = draft.suggestedApproach;
    result.draftMessage = draft.draftMessage;
    return this.results.save(result);
  }
}
