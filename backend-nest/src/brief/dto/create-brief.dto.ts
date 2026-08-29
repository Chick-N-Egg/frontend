import { IsString, MinLength } from 'class-validator';

export class CreateBriefDto {
  /**
   * Free-text description of the product and its audience, in the founder's
   * own words. Minimum 10 characters — extracted into productSummary,
   * audienceSegments and stage by OpenAI.
   */
  @IsString()
  @MinLength(10)
  rawInput: string;
}
