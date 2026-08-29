import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultEntity } from './entities/result.entity';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { ScoringService } from './scoring/scoring.service';
import { RESULT_REPOSITORY } from './ports/result.repository';
import { TypeOrmResultRepository } from './adapters/typeorm-result.repository';
import { CHANNEL_MATCHER } from './ports/channel-matcher';
import { OpenAiChannelMatcher } from './adapters/openai-channel-matcher';
import { BriefModule } from '../brief/brief.module';
import { ChannelCatalogModule } from '../channel-catalog/channel-catalog.module';
import { OpenAiModule } from '../openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResultEntity]),
    BriefModule,
    ChannelCatalogModule,
    OpenAiModule,
  ],
  controllers: [DiscoveryController],
  providers: [
    DiscoveryService,
    ScoringService,
    { provide: RESULT_REPOSITORY, useClass: TypeOrmResultRepository },
    { provide: CHANNEL_MATCHER, useClass: OpenAiChannelMatcher },
  ],
  exports: [ScoringService, RESULT_REPOSITORY],
})
export class DiscoveryModule {}
