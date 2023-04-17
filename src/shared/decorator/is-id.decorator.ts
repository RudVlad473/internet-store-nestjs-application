import { applyDecorators } from '@nestjs/common';
import { IsMongoId } from 'class-validator';

export const IsId = (): void | any =>
  applyDecorators(IsMongoId({ message: 'Provided id is incorrect' }));
