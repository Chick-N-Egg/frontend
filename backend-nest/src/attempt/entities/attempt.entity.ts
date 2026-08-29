import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResultEntity } from '../../discovery/entities/result.entity';
import { AttemptOutcome } from '../enums/attempt-outcome.enum';

@Entity('attempt')
export class AttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ResultEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'result_id' })
  result: ResultEntity;

  @Column({ name: 'result_id' })
  resultId: string;

  @Column({ type: 'text', name: 'message_sent' })
  messageSent: string;

  @Column({ type: 'enum', enum: AttemptOutcome })
  outcome: AttemptOutcome;

  // Same NUMERIC-as-string issue as ResultEntity.confidenceTotal.
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : parseFloat(value)),
    },
  })
  revenue: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'logged_at' })
  loggedAt: Date;
}
