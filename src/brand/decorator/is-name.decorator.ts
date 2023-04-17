import { applyDecorators } from '@nestjs/common';
import { MinLength, Validate } from 'class-validator';

import { IsUnicodeAlpha } from '../../shared/decorator';

const minNameLength = 3;

export const IsName = (): void | any =>
  applyDecorators(Validate(IsUnicodeAlpha), MinLength(minNameLength));
