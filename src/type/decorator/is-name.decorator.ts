import { applyDecorators } from '@nestjs/common';
import { MinLength, Validate } from 'class-validator';

import { IsUnicodeAlpha } from '../../shared/decorator/is-unicode-alpha.decorator';

const minNameLength = 5;

export const IsName = (): void | any =>
  applyDecorators(Validate(IsUnicodeAlpha), MinLength(minNameLength));
