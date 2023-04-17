import { applyDecorators } from '@nestjs/common';
import { MinLength } from 'class-validator';

const passwordMinLength = 6;

export const IsPassword = (): void | any =>
  applyDecorators(MinLength(passwordMinLength));
