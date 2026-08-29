import { AttemptEntity } from '../entities/attempt.entity';

export interface AttemptRepository {
  save(attempt: AttemptEntity): Promise<AttemptEntity>;
  findAll(): Promise<AttemptEntity[]>;
  findByResultId(resultId: string): Promise<AttemptEntity[]>;
}

export const ATTEMPT_REPOSITORY = Symbol('ATTEMPT_REPOSITORY');
