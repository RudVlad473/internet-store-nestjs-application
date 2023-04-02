import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signin() {
    return "You've been successfully signed in!";
  }

  async signup({ userName, email, password }: AuthDto) {
    const hashedPassword = await argon2.hash(password);

    return this.prisma.user.create({
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
  }
}
