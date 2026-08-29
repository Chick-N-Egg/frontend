import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AttemptOutcome } from '../enums/attempt-outcome.enum';

export class LogAttemptDto {
  @IsString()
  messageSent: string;

  @IsEnum(AttemptOutcome)
  outcome: AttemptOutcome;

  @IsOptional()
  @IsNumber()
  @Min(0)
  revenue?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
