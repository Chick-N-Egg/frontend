import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RESULT_REPOSITORY, ResultRepository } from '../discovery/ports/result.repository';
import { ATTEMPT_REPOSITORY, AttemptRepository } from './ports/attempt.repository';
import { AttemptEntity } from './entities/attempt.entity';
import { LogAttemptDto } from './dto/log-attempt.dto';
import { AttemptOutcome } from './enums/attempt-outcome.enum';

@Injectable()
export class AttemptService {
  constructor(
    @Inject(ATTEMPT_REPOSITORY) private readonly attempts: AttemptRepository,
    @Inject(RESULT_REPOSITORY) private readonly results: ResultRepository,
  ) {}

  async log(resultId: string, dto: LogAttemptDto): Promise<AttemptEntity> {
    const result = await this.results.findById(resultId);
    if (!result) throw new NotFoundException(`Result ${resultId} not found`);

    const attempt = new AttemptEntity();
    attempt.resultId = resultId;
    attempt.messageSent = dto.messageSent;
    attempt.outcome = dto.outcome;
    attempt.revenue = dto.outcome === AttemptOutcome.PAYING ? dto.revenue ?? null : null;
    attempt.notes = dto.notes ?? null;
    return this.attempts.save(attempt);
  }

  findAll(resultId?: string): Promise<AttemptEntity[]> {
    return resultId ? this.attempts.findByResultId(resultId) : this.attempts.findAll();
  }
}
