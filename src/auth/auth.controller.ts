import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Paths } from 'src/enums/paths';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(Paths.SIGN_IN)
  signin() {
    return this.authService.signin();
  }

  @Post(Paths.SIGN_UP)
  signup(@Body() userDto: AuthDto) {
    return this.authService.signup(userDto);
  }
}
