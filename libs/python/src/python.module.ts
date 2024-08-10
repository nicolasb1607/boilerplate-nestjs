import { Module } from '@nestjs/common';
import { PythonService } from './python.service';
import { PythonController } from '@app/python/python.controller';
import { AuthModule } from '@app/auth';

@Module({
  imports: [AuthModule],
  providers: [PythonService],
  controllers: [PythonController],
  exports: [PythonService],
})
export class PythonModule {}
