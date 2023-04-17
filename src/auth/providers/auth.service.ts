import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../../prisma/prisma.service';
import { PayloadUser } from '../../shared/types/payload-user.type';
import { AuthDto, SignInDto } from '../dto';
import { AccessToken, ISignUp } from '../types/ISignUp';
import { JwtPayloadUser } from '../types/user';
import { RoleService } from './role.service';

@Injectable()
export class AuthService implements ISignUp<AccessToken> {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private roleService: RoleService,
  ) {}

  async signToken({ id, email, role }: PayloadUser): Promise<AccessToken> {
    const payload = {
      sub: id,
      email,
      role,
    } as JwtPayloadUser;

    const token = this.jwt.sign(payload, {
      expiresIn: process.env.JWT_EXPIRE,
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }

  async signin(signinDto: SignInDto) {
    const user = await this.getUserByLogin(signinDto);

    if (!user) {
      throw new ForbiddenException('Check your credentials');
    }

    const passwordsMatch = await argon2.verify(user.hash, signinDto.password);

    if (!passwordsMatch) {
      throw new ForbiddenException('Check your credentials');
    }

    return this.signToken(user);
  }

  async signup({ userName, email, password }: AuthDto): Promise<AccessToken> {
    const existantUser = await this.getUserByLogin({ userName, email });

    if (existantUser) {
      return this.signin({ userName, email, password });
    }

    const userRole = await this.roleService.getUserRole(email);
    const hashedPassword = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        userName,
        email,
        hash: hashedPassword,

        role: userRole,

        cart: {
          create: {},
        },
      },
    });

    return this.signToken(user);
  }

  async getUserByLogin({ userName, email }: Pick<User, 'userName' | 'email'>) {
    //get either userName or email
    const loginData = userName ? { userName } : { email };

    const user = await this.prisma.user.findUnique({
      where: loginData,
    });
    return user;
  }
}
