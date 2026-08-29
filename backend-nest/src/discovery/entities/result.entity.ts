import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BriefEntity } from '../../brief/entities/brief.entity';
import { ChannelType } from '../enums/channel-type.enum';
import { ResultSource } from '../enums/result-source.enum';

@Entity('result')
export class ResultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BriefEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brief_id' })
  brief: BriefEntity;

  @Column({ name: 'brief_id' })
  briefId: string;

  @Column({ type: 'enum', enum: ChannelType, name: 'channel_type' })
  channelType: ChannelType;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  url: string | null;

  @Column({ type: 'text', name: 'why_it_fits' })
  whyItFits: string;

  @Column({ type: 'smallint', name: 'reach_score' })
  reachScore: number;

  @Column({ type: 'smallint', name: 'receptiveness_score' })
  receptivenessScore: number;

  @Column({ type: 'smallint', name: 'warmth_score' })
  warmthScore: number;

  // node-postgres returns NUMERIC columns as strings by default (to avoid
  // silent precision loss); coerce back to a real JS number on read.
  @Column({
    type: 'numeric',
    precision: 4,
    scale: 2,
    name: 'confidence_total',
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value === null ? null : parseFloat(value)),
    },
  })
  confidenceTotal: number;

  @Column({ type: 'enum', enum: ResultSource })
  source: ResultSource;

  @Column({ type: 'text', name: 'suggested_approach', nullable: true })
  suggestedApproach: string | null;

  @Column({ type: 'text', name: 'draft_message', nullable: true })
  draftMessage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
