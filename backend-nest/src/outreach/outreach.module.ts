import { Module } from '@nestjs/common';
import { OutreachController } from './outreach.controller';
import { OutreachService } from './outreach.service';
import { OutreachDrafter } from './ai/outreach-drafter';
import { BriefModule } from '../brief/brief.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { OpenAiModule } from '../openai/openai.module';

@Module({
  imports: [BriefModule, DiscoveryModule, OpenAiModule],
  controllers: [OutreachController],
  providers: [OutreachService, OutreachDrafter],
})
export class OutreachModule {}
