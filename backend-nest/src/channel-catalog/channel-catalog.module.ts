import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelCandidateEntity } from './entities/channel-candidate.entity';
import { ChannelCatalogService } from './channel-catalog.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelCandidateEntity])],
  providers: [ChannelCatalogService],
  exports: [ChannelCatalogService],
})
export class ChannelCatalogModule {}
