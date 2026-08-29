import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Stage } from '../enums/stage.enum';

export class UpdateBriefDto {
  @IsOptional()
  @IsString()
  productSummary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  audienceSegments?: string[];

  @IsOptional()
  @IsEnum(Stage)
  stage?: Stage;
}
