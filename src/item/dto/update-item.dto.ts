import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

import { TCreateItem } from '../../shared/test/initMocks';
import { IsTitle } from '../decorator';

export class UpdateItemDto implements Partial<TCreateItem> {
  @IsOptional()
  @IsTitle()
  title?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsOptional()
  @IsMongoId()
  type_id?: string;

  @IsOptional()
  @IsMongoId()
  brand_id?: string;
}
