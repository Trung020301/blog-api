import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { PayloadAuthDto } from './dto/PayloadAuthDto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Roles } from 'src/decorators/roles.decorator';

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
  @Get('profile')
  getHello(@Req() req: Request) {
    return req.user;
  }

  @Roles('admin')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('protected')
  async protected() {
    return 'Protected route';
  }
  // async profile(@Req() req: Request) {
  //   return req.user;
  // }
}
