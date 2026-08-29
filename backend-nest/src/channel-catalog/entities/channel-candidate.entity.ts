import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ChannelType } from '../../discovery/enums/channel-type.enum';

/**
 * Seeded from backend/communities.json — a static, hand-curated catalog.
 * PRODUCT_SPEC.md calls for "verified, sourced data" (the fictitious "Cala"
 * service); this is the honest MVP substitute, documented as a known
 * limitation. externalId keeps the original catalog id for idempotent re-seeding.
 */
@Entity('channel_candidate')
@Unique(['externalId'])
export class ChannelCandidateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'external_id' })
  externalId: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ChannelType })
  channelType: ChannelType;

  @Column({ type: 'varchar', nullable: true })
  url: string | null;

  @Column({ type: 'varchar', nullable: true })
  size: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  tags: string[];

  @Column({ type: 'varchar', nullable: true })
  engagement: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  categories: string[];
}
