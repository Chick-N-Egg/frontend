import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { BriefEntity } from '../brief/entities/brief.entity';
import { ResultEntity } from '../discovery/entities/result.entity';
import { AttemptEntity } from '../attempt/entities/attempt.entity';
import { ChannelCandidateEntity } from '../channel-catalog/entities/channel-candidate.entity';

/**
 * Standalone DataSource for the CLI seed script (npm run seed), separate
 * from the DataSource NestJS manages via TypeOrmModule at app bootstrap.
 */
export const seedDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [BriefEntity, ResultEntity, AttemptEntity, ChannelCandidateEntity],
  synchronize: true,
});
