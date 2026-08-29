import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BriefEntity } from './entities/brief.entity';
import { BriefController } from './brief.controller';
import { BriefService } from './brief.service';
import { BriefExtractor } from './ai/brief-extractor';
import { BRIEF_REPOSITORY } from './ports/brief.repository';
import { TypeOrmBriefRepository } from './adapters/typeorm-brief.repository';
import { OpenAiModule } from '../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([BriefEntity]), OpenAiModule],
  controllers: [BriefController],
  providers: [
    BriefService,
    BriefExtractor,
    { provide: BRIEF_REPOSITORY, useClass: TypeOrmBriefRepository },
  ],
  exports: [BriefService, BRIEF_REPOSITORY],
})
export class BriefModule {}
