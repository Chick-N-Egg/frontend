import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import { BriefModule } from './brief/brief.module';
import { ChannelCatalogModule } from './channel-catalog/channel-catalog.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { OutreachModule } from './outreach/outreach.module';
import { AttemptModule } from './attempt/attempt.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm')!,
    }),
    BriefModule,
    ChannelCatalogModule,
    DiscoveryModule,
    OutreachModule,
    AttemptModule,
    DashboardModule,
  ],
})
export class AppModule {}
