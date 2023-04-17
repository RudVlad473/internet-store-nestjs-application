import { Category } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsName } from '../decorator';

export class CreateCategoryDto implements Omit<Category, 'id'> {
  @IsNotEmpty()
  @IsName()
  name: string;
}
