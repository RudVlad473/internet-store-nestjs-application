import { applyDecorators } from '@nestjs/common';
import { IsAlphanumeric, MinLength } from 'class-validator';

const userNameMinLength = 6;

export const IsUserName = (): void | any =>
  applyDecorators(IsAlphanumeric(), MinLength(userNameMinLength));
