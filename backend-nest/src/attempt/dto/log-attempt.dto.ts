import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AttemptOutcome } from '../enums/attempt-outcome.enum';

export class LogAttemptDto {
  /** The message actually sent, editable copy of the generated draft_message. */
  @IsString()
  messageSent: string;

  /** What happened after sending. */
  @IsEnum(AttemptOutcome)
  outcome: AttemptOutcome;

  /** Only meaningful when outcome is "paying"; ignored otherwise. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  revenue?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
