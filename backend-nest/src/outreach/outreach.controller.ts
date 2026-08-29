import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutreachService } from './outreach.service';

@ApiTags('outreach')
@Controller('results')
export class OutreachController {
  constructor(private readonly outreachService: OutreachService) {}

  @Post(':resultId/outreach')
  @ApiOperation({
    summary: 'Generate suggested_approach and draft_message for a Result',
    description: 'Value-first copy — never pitches the product in the first message.',
  })
  generate(@Param('resultId') resultId: string) {
    return this.outreachService.generate(resultId);
  }
}
