import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BriefEntity } from '../brief/entities/brief.entity';
import { ResultEntity } from '../discovery/entities/result.entity';
import { AttemptEntity } from '../attempt/entities/attempt.entity';
import { ChannelCandidateEntity } from '../channel-catalog/entities/channel-candidate.entity';

export default registerAs('typeorm', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [BriefEntity, ResultEntity, AttemptEntity, ChannelCandidateEntity],
  synchronize: true,
  autoLoadEntities: true,
}));
