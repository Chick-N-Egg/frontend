import { ResultEntity } from '../entities/result.entity';

export interface ResultRepository {
  findById(id: string): Promise<ResultEntity | null>;
  findByBriefId(briefId: string): Promise<ResultEntity[]>;
  save(result: ResultEntity): Promise<ResultEntity>;
  saveMany(results: ResultEntity[]): Promise<ResultEntity[]>;
}

export const RESULT_REPOSITORY = Symbol('RESULT_REPOSITORY');
