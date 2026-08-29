import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AttemptModule } from '../attempt/attempt.module';

@Module({
  imports: [AttemptModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
