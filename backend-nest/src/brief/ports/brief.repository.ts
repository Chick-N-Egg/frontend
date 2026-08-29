import { BriefEntity } from '../entities/brief.entity';

export interface BriefRepository {
  findById(id: string): Promise<BriefEntity | null>;
  save(brief: BriefEntity): Promise<BriefEntity>;
}

export const BRIEF_REPOSITORY = Symbol('BRIEF_REPOSITORY');
