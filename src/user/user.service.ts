import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PayloadUser } from 'src/auth/strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByUsername(userName: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userName,
      },
    });

    return this.getSecureUserData(user);
  }

  async getSelf({ email }: PayloadUser) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return this.getFullUserData(foundUser);
  }

  getFullUserData({ email, userName, role, createdAt }: User) {
    return {
      ...this.getSecureUserData({ userName, createdAt }),

      email,
      role,
    };
  }

  getSecureUserData({ userName, createdAt }: Partial<User>) {
    return {
      userName,
      createdAt: createdAt.toDateString(),
    };
  }
}
