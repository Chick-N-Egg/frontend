import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard')
  get() {
    return this.dashboardService.build();
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
