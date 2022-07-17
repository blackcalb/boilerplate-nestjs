import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/pipes/SignUpPipe';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpSchema } from './dto/SignUp.dto';
import { GoogleAuthGuard } from './google/google.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LocalAuthGuard } from './local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.getUserInfo(req.user.userId);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(SignUpSchema))
  async signUp(@Body() userData: SignUpDto) {
    return this.authService.signUp(userData);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    //this is empty because
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }
}
