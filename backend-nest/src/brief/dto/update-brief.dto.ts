import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Stage } from '../enums/stage.enum';

export class UpdateBriefDto {
  /** Edited product summary chip. */
  @IsOptional()
  @IsString()
  productSummary?: string;

  /** Edited audience segment chips (full replacement array, not a delta). */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  audienceSegments?: string[];

  /** Edited stage chip. */
  @IsOptional()
  @IsEnum(Stage)
  stage?: Stage;
}
