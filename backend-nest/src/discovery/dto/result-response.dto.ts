import { ResultEntity } from '../entities/result.entity';

export class ResultResponseDto {
  static from(result: ResultEntity, topConfidence: number): ResultResponseDto & ResultEntity {
    return {
      ...result,
      isBestShot: result.confidenceTotal === topConfidence,
    } as ResultResponseDto & ResultEntity;
  }

  isBestShot: boolean;
}
