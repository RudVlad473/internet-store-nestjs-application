import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { PayloadGoogleUser } from '../../user/types';
import { IVerifiable } from '../types/IVerifiable';
import { callbackURL, scope } from './consts';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL,
      scope,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): any & IVerifiable {
    const googleUser: PayloadGoogleUser = profile._json;

    // const signupUser: AuthDto = {
    //   email: googleUser.email,
    //   userName: googleUser.name,
    //   password: '',
    //   role: 'DEFAULT',
    // };

    const user: PayloadGoogleUser = googleUser;
    // done(null, user);
    return user;
  }
}
