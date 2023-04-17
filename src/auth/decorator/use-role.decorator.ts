import { UseGuards, applyDecorators } from '@nestjs/common';
import { Roles } from '@prisma/client';

import { AdminGuard, DefaultGuard, FinalGuard } from '../guard';

export const UseAuthRole = (role?: Roles): void | any => {
  let roleDecorator;

  switch (role) {
    case 'ADMIN': {
      roleDecorator = AdminGuard;
      break;
    }
    case 'DEFAULT': {
      roleDecorator = DefaultGuard;
    }
  }

  return applyDecorators(UseGuards(FinalGuard), UseGuards(roleDecorator));
};
