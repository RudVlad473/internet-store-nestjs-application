import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { IsName } from '../decorator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsName()
  name?: string;
}
