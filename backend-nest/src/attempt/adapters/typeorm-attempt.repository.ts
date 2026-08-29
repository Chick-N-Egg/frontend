import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttemptEntity } from '../entities/attempt.entity';
import { AttemptRepository } from '../ports/attempt.repository';

@Injectable()
export class TypeOrmAttemptRepository implements AttemptRepository {
  constructor(
    @InjectRepository(AttemptEntity)
    private readonly repo: Repository<AttemptEntity>,
  ) {}

  save(attempt: AttemptEntity): Promise<AttemptEntity> {
    return this.repo.save(attempt);
  }

  findAll(): Promise<AttemptEntity[]> {
    return this.repo.find({ relations: ['result'], order: { loggedAt: 'DESC' } });
  }

  findByResultId(resultId: string): Promise<AttemptEntity[]> {
    return this.repo.find({
      where: { resultId },
      relations: ['result'],
      order: { loggedAt: 'DESC' },
    });
  }
}
