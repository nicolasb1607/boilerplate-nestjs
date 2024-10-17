import { Module } from '@nestjs/common';
import { PexelsService } from './pexels.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { config } from 'libs/shared/configs/axios.config';

@Module({
  imports: [HttpModule.register(config)],
  providers: [PexelsService],
  exports: [PexelsService],
})
export class PexelsModule {}
