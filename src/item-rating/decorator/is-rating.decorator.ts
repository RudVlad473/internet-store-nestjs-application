import { applyDecorators } from '@nestjs/common';
import { IsNumber, Max, Min } from 'class-validator';

const minRating = 1;
const maxRating = 5;

export const IsRating = (): void | any =>
  applyDecorators(IsNumber(), Min(minRating), Max(maxRating));
