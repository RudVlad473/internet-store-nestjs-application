import {
  Controller,
  ForbiddenException,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthPaths } from '../../shared/types/paths';
import { PayloadGoogleUser } from '../../user/types';
import { User } from '../decorator';
import { GoogleGuard } from '../guard';
import { GoogleService } from '../providers/google-auth.service';
import { AccessToken } from '../types/ISignUp';

@Controller()
@UseGuards(GoogleGuard)
export class GoogleAuthController {
  constructor(private googleService: GoogleService) {}

  @Get(AuthPaths.GOOGLE)
  async signin(
    @User() user: PayloadGoogleUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    let token: AccessToken;
    try {
      token = await this.googleService.signin(user);
    } catch (e) {
      throw new ForbiddenException('Google auth error');
    }

    // const [header, value] = constructJwtBearerHeader(token);
    // res.setHeader(header, value);
    return token;
  }

  @Get(`${AuthPaths.GOOGLE}/${AuthPaths.GOOGLE_SIGN_UP}`)
  async signup(
    @User() user: PayloadGoogleUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    let token: AccessToken;
    try {
      token = await this.googleService.signup(user);
    } catch (e) {
      throw new ForbiddenException('Google auth error');
    }

    // const [header, value] = constructJwtBearerHeader(token);
    // res.setHeader(header, value);
    return token;
  }
}
