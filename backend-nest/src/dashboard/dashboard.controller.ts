import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'KPIs, funnel, per-channel performance and refinement insight',
    description: 'refinementInsight is null until 3+ attempts are logged.',
  })
  get() {
    return this.dashboardService.build();
  }

  @Get('health')
  @ApiOperation({ summary: 'Healthcheck' })
  health() {
    return { status: 'ok' };
  }
}
