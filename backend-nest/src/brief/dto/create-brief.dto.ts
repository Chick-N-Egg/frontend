import { IsString, MinLength } from 'class-validator';

export class CreateBriefDto {
  @IsString()
  @MinLength(10)
  rawInput: string;
}
