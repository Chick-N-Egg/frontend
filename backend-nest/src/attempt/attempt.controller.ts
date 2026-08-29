import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { LogAttemptDto } from './dto/log-attempt.dto';

@Controller()
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post('results/:resultId/attempts')
  log(@Param('resultId') resultId: string, @Body() dto: LogAttemptDto) {
    return this.attemptService.log(resultId, dto);
  }

  @Get('attempts')
  findAll(@Query('resultId') resultId?: string) {
    return this.attemptService.findAll(resultId);
  }
}
