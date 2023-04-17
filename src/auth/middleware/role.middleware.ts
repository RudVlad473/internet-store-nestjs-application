import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { RoleService } from '../providers/role.service';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private roleService: RoleService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //used to extract user email from request and make a database call to retrieve full information about user (presumably NOT a default user (admin, ...))
    console.log({ req });

    const user = req.user as Express.User & { email: string };

    if (!user) {
      throw new ForbiddenException("Request didn't contain user");
    }

    const userEmail = user.email;

    if (!userEmail) {
      throw new ForbiddenException("Request didn't contain email");
    }

    const userRole: Roles = await this.roleService.getUserRole(userEmail);

    req.user = {
      ...req.user,
      role: userRole,
    };
    next();
  }
}
