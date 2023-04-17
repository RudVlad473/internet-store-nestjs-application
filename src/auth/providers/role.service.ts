import { Injectable } from '@nestjs/common';
import { Roles, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getUserRole(email: User['email']): Promise<Roles> {
    const isAdmin = await this.prisma.adminEmails.findUnique({
      where: {
        email,
      },
    });

    return isAdmin ? 'ADMIN' : 'DEFAULT';
  }
}
