import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { PayloadGoogleUser } from '../../user/types';
import { AccessToken, ISignUp } from '../types/ISignUp';
import { AuthService } from './auth.service';
import { RoleService } from './role.service';

@Injectable()
export class GoogleService implements ISignUp<AccessToken> {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private authService: AuthService,
    private roleService: RoleService,
  ) {}

  async signin(user: PayloadGoogleUser) {
    return {
      access_token: user.access_token,
    };
  }

  async signup(user: PayloadGoogleUser) {
    //TODO: remake the google redirection endpoint to be 'redirect' and handle signin/signup logic there
    if (!user.email_verified) {
      throw new ForbiddenException("Email wasn't verified");
    }

    const existantUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const isGoogleAuthedUser = await this.prisma.googleAuthUsers.findUnique({
      where: {
        id: existantUser.id,
      },
    });

    if (isGoogleAuthedUser) {
      return this.signin(user);
    }
    if (!existantUser) {
      try {
        const userRole = await this.roleService.getUserRole(user.email);

        if (userRole !== 'DEFAULT') {
          throw new ForbiddenException(
            `If you are going to signup as ${userRole}, you have to signup via regular authentification (using your password, email, etc)`,
          );
        }

        const { id } = await this.prisma.user.create({
          data: {
            email: user.email,
            userName: user.name,
            role: userRole,
          },
        });

        await this.prisma.googleAuthUsers.create({
          data: {
            user_id: id,
          },
        });
      } catch (e) {
        throw new ForbiddenException({
          msg: 'User creation after google authentication failed',
          details: e,
        });
      }
    }

    return {
      access_token: user.access_token,
    };
  }
}
