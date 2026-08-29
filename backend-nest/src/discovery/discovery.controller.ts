import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscoveryService } from './discovery.service';

@ApiTags('discovery')
@Controller()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Post('briefs/:briefId/discover')
  @ApiOperation({
    summary: 'Match channels against a Brief and score them',
    description:
      'Runs OpenAI matching against the seeded channel catalog, computes ' +
      'confidence_total per result, persists them, and returns them ranked ' +
      'with the top one flagged isBestShot.',
  })
  discover(@Param('briefId') briefId: string) {
    return this.discoveryService.discover(briefId);
  }

  @Get('briefs/:briefId/results')
  @ApiOperation({ summary: 'List previously generated results for a Brief' })
  findResults(@Param('briefId') briefId: string) {
    return this.discoveryService.findByBriefId(briefId);
  }
}
