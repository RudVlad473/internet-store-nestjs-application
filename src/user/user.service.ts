import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PayloadUser } from '../shared/types';
import { EditUserDto } from './dto/editUser.dto';

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

  async editSelf({
    email,
    userName,
  }: Pick<PayloadUser, 'email'> & EditUserDto) {
    const patchedUser = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        userName,
      },
    });

    return this.getFullUserData(patchedUser);
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
