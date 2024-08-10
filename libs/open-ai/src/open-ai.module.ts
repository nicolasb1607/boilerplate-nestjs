import { OpenAiService } from '@app/open-ai/open-ai.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule { }
