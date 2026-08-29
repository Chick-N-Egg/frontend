import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptEntity } from './entities/attempt.entity';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import { ATTEMPT_REPOSITORY } from './ports/attempt.repository';
import { TypeOrmAttemptRepository } from './adapters/typeorm-attempt.repository';
import { DiscoveryModule } from '../discovery/discovery.module';

@Module({
  imports: [TypeOrmModule.forFeature([AttemptEntity]), DiscoveryModule],
  controllers: [AttemptController],
  providers: [
    AttemptService,
    { provide: ATTEMPT_REPOSITORY, useClass: TypeOrmAttemptRepository },
  ],
  exports: [ATTEMPT_REPOSITORY],
})
export class AttemptModule {}
