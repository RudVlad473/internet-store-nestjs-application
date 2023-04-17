import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthPaths } from '../../shared/types/paths';
import { AuthDto, SignInDto } from '../dto';
import { AuthService } from '../providers/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(AuthPaths.SIGN_IN)
  async signin(
    @Body() signinDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signin(signinDto);

    // const [header, value] = constructJwtBearerHeader(token);
    // res.setHeader(header, value);
    return token;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(AuthPaths.SIGN_UP)
  async signup(
    @Body() userDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signup(userDto);

    // const [header, value] = constructJwtBearerHeader(token);
    // res.setHeader(header, value);
    return token;
  }
}
