import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl } from 'class-validator';

import { IsName } from '../decorator';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsOptional()
  @IsName()
  name?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;
}
