import { applyDecorators } from '@nestjs/common';
import { MaxLength, MinLength } from 'class-validator';

const minContentLength = 3;
const maxContentLength = 256;

export const IsContent = (): void | any =>
  applyDecorators(MinLength(minContentLength), MaxLength(maxContentLength));
