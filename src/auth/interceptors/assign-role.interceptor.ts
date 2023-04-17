import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssignRoleInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    const email = user?.email;

    const isRoleAlreadyAsigned = user?.role;

    if (!isRoleAlreadyAsigned && email) {
      const userFromDb = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      req.user = {
        ...user,
        role: userFromDb.role,
      };
    }

    return next.handle().pipe(tap(() => {}));
  }
}
