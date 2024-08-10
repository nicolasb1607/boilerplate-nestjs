import {
  IsPublic,
  JwtToken,
  UserLoginDto,
  UserRegistrationDto,
} from '@app/auth';
import { UserEntity } from '@app/database';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthApiService } from 'apps/api/src/auth-api/auth-api.service';

@ApiTags('authentication')
@Controller('auth-api')
export class AuthApiController {
  constructor(private readonly authApiService: AuthApiService) { }

  @IsPublic()
  @Post('register')
  @ApiBody({ type: UserRegistrationDto })
  @ApiResponse({ status: 200, type: JwtToken })
  async register(@Body() dto: UserRegistrationDto): Promise<void> {
    return await this.authApiService.register(dto);
  }

  @IsPublic()
  @Get('verify')
  async verify(@Query('token') token: string): Promise<UserEntity> {
    return await this.authApiService.verify(token);
  }

  @IsPublic()
  @Post('login')
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, type: JwtToken })
  async login(@Body() dto: UserLoginDto): Promise<JwtToken | UserEntity> {
    return await this.authApiService.login(dto);
  }
}
