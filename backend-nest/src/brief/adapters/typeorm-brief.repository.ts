import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BriefEntity } from '../entities/brief.entity';
import { BriefRepository } from '../ports/brief.repository';

@Injectable()
export class TypeOrmBriefRepository implements BriefRepository {
  constructor(
    @InjectRepository(BriefEntity)
    private readonly repo: Repository<BriefEntity>,
  ) {}

  findById(id: string): Promise<BriefEntity | null> {
    return this.repo.findOneBy({ id });
  }

  save(brief: BriefEntity): Promise<BriefEntity> {
    return this.repo.save(brief);
  }
}
