import { Module } from '@nestjs/common';
import { openaiProvider } from './openai.provider';

@Module({
  providers: [openaiProvider],
  exports: [openaiProvider],
})
export class OpenAiModule {}
