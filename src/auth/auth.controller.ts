import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { PayloadAuthDto } from './dto/PayloadAuthDto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() req: Request) {
    return this.authService.signIn(req.user);
  }

  @Post('sign-up')
  async signUp(@Body() payloadAuthDto: PayloadAuthDto) {
    return this.authService.createUser(payloadAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sign-out')
  async signOut(@Req() req: Request) {
    return this.authService.signOut(req.user['sub']);
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh-token')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Roles('admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('protected')
  async protected() {
    return 'Protected route';
  }
}
