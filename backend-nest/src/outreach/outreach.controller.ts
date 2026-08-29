import { Controller, Param, Post } from '@nestjs/common';
import { OutreachService } from './outreach.service';

@Controller('results')
export class OutreachController {
  constructor(private readonly outreachService: OutreachService) {}

  @Post(':resultId/outreach')
  generate(@Param('resultId') resultId: string) {
    return this.outreachService.generate(resultId);
  }
}
