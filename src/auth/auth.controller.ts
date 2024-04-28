import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { PayloadAuthDto } from './dto/PayloadAuthDto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalGuard)
  async signIn(@Req() req: Request) {
    return req.user;
  }

  @Post('sign-up')
  async signUp(@Body() payloadAuthDto: PayloadAuthDto) {
    return this.authService.createUser(payloadAuthDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request) {
    return req.user;
  }
}
