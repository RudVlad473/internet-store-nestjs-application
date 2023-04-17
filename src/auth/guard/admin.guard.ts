import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const requestRole = user.role as Roles;
    const email = user.email;

    if (!requestRole) {
      const { role } = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return role === Roles.ADMIN;
    }

    return requestRole === Roles.ADMIN;
  }
}
