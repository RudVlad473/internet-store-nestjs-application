import { applyDecorators } from '@nestjs/common';
import { IsNumber, Max, Min } from 'class-validator';

const minCartItemQuantity = 1;
const maxCartItemQuantity = 256;

export const IsQuantity = (): void | any =>
  applyDecorators(
    IsNumber(),
    Min(minCartItemQuantity),
    Max(maxCartItemQuantity),
  );
