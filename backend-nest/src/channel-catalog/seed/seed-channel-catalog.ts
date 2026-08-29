import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ChannelCandidateEntity } from '../entities/channel-candidate.entity';
import { channelTypeFromPlatform } from '../../discovery/enums/channel-type.enum';

interface RawCommunity {
  id: string;
  name: string;
  platform: string;
  url?: string;
  size?: string;
  tags?: string[];
  engagement?: string;
  categories?: string[];
}

/**
 * Idempotent seed: run on container start (see entrypoint.sh) so the static
 * catalog is available before any /briefs/:id/discover call. Safe to re-run —
 * upserts on externalId.
 */
export async function seedChannelCatalog(dataSource: DataSource): Promise<void> {
  const seedPath = path.join(__dirname, 'communities.seed.json');
  const raw = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as {
    communities: RawCommunity[];
  };

  const repo = dataSource.getRepository(ChannelCandidateEntity);

  for (const community of raw.communities) {
    const existing = await repo.findOneBy({ externalId: community.id });
    const entity = existing ?? new ChannelCandidateEntity();
    entity.externalId = community.id;
    entity.name = community.name;
    entity.channelType = channelTypeFromPlatform(community.platform);
    entity.url = community.url ?? null;
    entity.size = community.size ?? null;
    entity.tags = community.tags ?? [];
    entity.engagement = community.engagement ?? null;
    entity.categories = community.categories ?? [];
    await repo.save(entity);
  }
}

/* istanbul ignore next -- exercised via `npm run seed`, not unit tested */
if (require.main === module) {
  const dataSourcePath = path.join(__dirname, '..', '..', 'config', 'seed-data-source.js');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { seedDataSource } = require(dataSourcePath);
  seedDataSource
    .initialize()
    .then((ds: DataSource) => seedChannelCatalog(ds))
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error(err);
      process.exit(1);
    });
}
