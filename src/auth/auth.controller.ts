import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Paths } from 'src/enums/paths';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(Paths.SIGN_IN)
  signin() {
    return this.authService.signin();
  }

  @Post(Paths.SIGN_UP)
  signup() {
    return this.authService.signup();
  }
}
