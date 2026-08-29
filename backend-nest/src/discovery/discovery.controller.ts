import { Controller, Get, Param, Post } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Post('briefs/:briefId/discover')
  discover(@Param('briefId') briefId: string) {
    return this.discoveryService.discover(briefId);
  }

  @Get('briefs/:briefId/results')
  findResults(@Param('briefId') briefId: string) {
    return this.discoveryService.findByBriefId(briefId);
  }
}
