import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPaths } from '../enums/paths';
import { AuthDto, SignInDto } from './dto';

@Controller(AuthPaths.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(AuthPaths.SIGN_IN)
  signin(@Body() signinDto: SignInDto) {
    return this.authService.signin(signinDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(AuthPaths.SIGN_UP)
  signup(@Body() userDto: AuthDto) {
    return this.authService.signup(userDto);
  }
}
