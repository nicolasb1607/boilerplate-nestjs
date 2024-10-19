import { IsPublic } from '@app/auth';
import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @IsPublic()
  @Get('heath-check')
  healthCheck(): Promise<void> {
    return;
  }
}
