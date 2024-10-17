import {
  EmailDto,
  IsPublic,
  JwtToken,
  Role,
  Roles,
  UserLoginDto,
  UserRegistrationDto,
  UserRequest,
} from '@app/auth';
import { GoogleConnectionDto } from '@app/auth/dtos/googleConnection.dto';
import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthApiService } from 'apps/api/src/auth-api/auth-api.service';

@ApiTags('authentication')
@Controller('auth-api')
export class AuthApiController {
  constructor(private readonly authApiService: AuthApiService) {}

  @IsPublic()
  @Post('userExist')
  @ApiBody({ type: EmailDto })
  @ApiResponse({ type: Boolean })
  async checkIfUserAlreadyExist(@Body() dto: EmailDto): Promise<boolean> {
    return await this.authApiService.authService.checkIfUserAlreadyExist(
      dto.email,
    );
  }

  @IsPublic()
  @Post('register')
  @ApiBody({ type: UserRegistrationDto })
  async register(@Body() dto: UserRegistrationDto): Promise<void> {
    return await this.authApiService.register(dto);
  }

  @IsPublic()
  @Post('login')
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, type: JwtToken })
  async login(@Body() dto: UserLoginDto): Promise<JwtToken> {
    return await this.authApiService.login(dto);
  }

  @Roles(Role.User)
  @Post('refreshToken')
  @ApiBearerAuth('refreshToken')
  @ApiResponse({ status: 200, type: JwtToken })
  async getRefreshToken(@Request() req: UserRequest): Promise<JwtToken> {
    return await this.authApiService.authService.refreshToken(req.user);
  }

  /****************************************************************************
   * PASSWORD BASED AUTHENTICATION
   ****************************************************************************/
  //@IsPublic()
  //@Post('verify')
  //@ApiBody({ type: VerifyUserDto, required: true })
  //@ApiResponse({ type: PublicUser })
  //async verify(@Body() dto: VerifyUserDto): Promise<JwtToken> {
  //  return await this.authApiService.verify(dto);
  //}

  //@IsPublic()
  //@Post('sendResetPasswordLink')
  //@ApiBody({ type: SendResetPasswordLinkDto })
  //async sendResetPasswordLink(
  //  @Body() dto: SendResetPasswordLinkDto,
  //): Promise<void> {
  //  return await this.authApiService.sendResetPasswordLink(dto);
  //}

  //@Roles(Role.User)
  //@Post('resetPassword')
  //@ApiBody({ type: ResetPasswordDto })
  //async resetPassword(
  //  @Request() req: UserRequest,
  //  @Body() dto: ResetPasswordDto,
  //): Promise<void> {
  //  return this.authApiService.resetPassword(req.user, dto);
  //}

  /*****************************************************************************
   * CODE BASED AUTHENTICATION
   ****************************************************************************/

  @IsPublic()
  @Get('sendCode')
  async sendCode(@Query('email') email: string): Promise<void> {
    return await this.authApiService.sendCode(email);
  }

  /*****************************************************************************
   * GOOGLE AUTHENTICATION
   ****************************************************************************/

  @IsPublic()
  @Post('google-login')
  @ApiBody({ type: GoogleConnectionDto, required: true })
  async googleAuth(@Body() dto: GoogleConnectionDto): Promise<JwtToken> {
    return await this.authApiService.authService.googleVerifyToken(dto.code);
  }

  //DEPRECATED
}
