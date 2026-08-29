import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttemptService } from './attempt.service';
import { LogAttemptDto } from './dto/log-attempt.dto';

@ApiTags('attempts')
@Controller()
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post('results/:resultId/attempts')
  @ApiOperation({ summary: 'Log an outreach attempt and its outcome' })
  log(@Param('resultId') resultId: string, @Body() dto: LogAttemptDto) {
    return this.attemptService.log(resultId, dto);
  }

  @Get('attempts')
  @ApiOperation({ summary: 'List attempts, optionally filtered by result' })
  @ApiQuery({ name: 'resultId', required: false })
  findAll(@Query('resultId') resultId?: string) {
    return this.attemptService.findAll(resultId);
  }
}
