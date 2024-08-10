import { Role, Roles } from '@app/auth';
import { PythonService } from '@app/python/python.service';
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) { }

  @Roles(Role.Admin)
  @Get('test')
  @ApiExcludeEndpoint()
  async getTestScript() {
    try {
      const result = await this.pythonService.runScript('test.script.py');
      console.log(result);
      return result;
    } catch (e) {
      throw new InternalServerErrorException(
        'Python error while running the script',
      );
    }
  }
}
