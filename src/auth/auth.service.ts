import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignInDto } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signin(signinDto: SignInDto) {
    if (!signinDto.userName && !signinDto.email) {
      throw new ForbiddenException(
        'You should either provide an email or a username',
      );
    }

    const password = signinDto.password;

    const user = await this.getUserByLogin(signinDto);

    if (!user) {
      throw new ForbiddenException('Check your credentials');
    }

    const passwordsMatch = await argon2.verify(user.hash, password);

    if (!passwordsMatch) {
      throw new ForbiddenException('Passwords do not match');
    }

    return this.signToken(user);
  }

  async signup({ userName, email, password }: AuthDto) {
    try {
      const existantUser = await this.getUserByLogin({ userName, email });

      if (existantUser) {
        throw new ForbiddenException(
          'User with the same email or/and username already exists',
        );
      }

      const hashedPassword = await argon2.hash(password);

      const user = await this.prisma.user.create({
        data: {
          userName,
          email,
          hash: hashedPassword,

          role: 'DEFAULT',

          cart: {
            create: {},
          },
        },
      });

      return this.signToken(user);
    } catch (e) {
      throw new ForbiddenException({ e });
    }
  }

  signToken({ id, email, role }: Pick<User, 'id' | 'email' | 'role'>) {
    const payload = {
      sub: id,
      email,
      role,
    };

    const token = this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRE,
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }

  async getUserByLogin(login: Pick<User, 'userName' | 'email'>) {
    //get either userName or email
    const loginData = (() => {
      for (const key in login) {
        if (login[key]) {
          return {
            [key]: login[key],
          } as Partial<Pick<User, 'userName' | 'email'>>;
        }
      }
    })();

    const user = await this.prisma.user.findUnique({
      where: loginData,
    });
    return user;
  }
}
