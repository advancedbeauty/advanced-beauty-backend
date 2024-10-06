import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google/login")
  googleLogin() {
    
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  googleCallback(@Req() req) {
    // const response = await this.authService.login
  }
}
