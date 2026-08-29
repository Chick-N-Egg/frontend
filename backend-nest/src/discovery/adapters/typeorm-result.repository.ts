import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultEntity } from '../entities/result.entity';
import { ResultRepository } from '../ports/result.repository';

@Injectable()
export class TypeOrmResultRepository implements ResultRepository {
  constructor(
    @InjectRepository(ResultEntity)
    private readonly repo: Repository<ResultEntity>,
  ) {}

  findById(id: string): Promise<ResultEntity | null> {
    return this.repo.findOneBy({ id });
  }

  findByBriefId(briefId: string): Promise<ResultEntity[]> {
    return this.repo.find({
      where: { briefId },
      order: { confidenceTotal: 'DESC' },
    });
  }

  save(result: ResultEntity): Promise<ResultEntity> {
    return this.repo.save(result);
  }

  saveMany(results: ResultEntity[]): Promise<ResultEntity[]> {
    return this.repo.save(results);
  }
}
