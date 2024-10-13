import { Controller, Get, HttpCode, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { id, accessToken, refreshToken } = await this.authService.login(req.user.id);
    res.cookie('id', id, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json ({
      message: "Logged In",
    })
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Response() res) {
    const { id, accessToken, refreshToken } = await this.authService.refreshToken(req.user.id);
    res.cookie('id', id, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json ({
      message: "Refresh token generated"
    })
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(@Request() req) {
    await this.authService.signOut(req.user.id);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Response() res) {
    const { id, accessToken, refreshToken } = await this.authService.login(req.user.id);
    res.cookie('id', id, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json ({
      message: "Logged In"
    })
  }
}
