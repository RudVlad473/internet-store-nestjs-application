import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { IsId } from '../../shared/decorator';
import { IsName } from '../decorator';
import { CreateTypeDto } from './create-type.dto';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {
  @IsOptional()
  @IsName()
  name?: string;

  @IsOptional()
  @IsId()
  category_id?: string;
}
