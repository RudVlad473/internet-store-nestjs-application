import { applyDecorators } from '@nestjs/common';
import { MinLength, Validate } from 'class-validator';

import { IsUnicodeAlphaNumeric } from '../../shared/decorator';

const minTitleLength = 10;

export const IsTitle = (): void | any =>
  applyDecorators(Validate(IsUnicodeAlphaNumeric), MinLength(minTitleLength));
