import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Stage } from '../enums/stage.enum';

@Entity('brief')
export class BriefEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  rawInput: string;

  @Column({ type: 'text' })
  productSummary: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  audienceSegments: string[];

  @Column({ type: 'enum', enum: Stage, default: Stage.IDEA })
  stage: Stage;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
