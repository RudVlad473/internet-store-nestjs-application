import { applyDecorators } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Equals, IsIn, IsNotEmpty, IsString } from 'class-validator';

import { roles } from '../types/enums';

export const IsRole = (role?: Roles): void | any =>
  applyDecorators(IsString(), IsNotEmpty(), role ? Equals(role) : IsIn(roles));
