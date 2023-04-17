import {
  ExecutionContext,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { IsAlphanumeric, NotEquals } from 'class-validator';

import { UserPaths } from '../../shared/types/paths';
import { PayloadUser } from '../../shared/types/payload-user.type';
import { JwtPayloadUser } from '../types/user';

type Parameters = keyof JwtPayloadUser | undefined;

//type ReturnValue = PayloadUser | PayloadUser[keyof PayloadUser];

export const IsUserName = (): void | any =>
  applyDecorators(IsAlphanumeric(), NotEquals(UserPaths.SELF));

export const User = createParamDecorator(
  <T extends Parameters>(
    data: T,
    ctx: ExecutionContext,
  ): PayloadUser | PayloadUser[keyof PayloadUser] => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    return data ? user[data] : user;
  },
);
