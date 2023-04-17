import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

import { IsId } from '../../shared/decorator';
import { TCreateItem } from '../../shared/test/initMocks';
import { IsTitle } from '../decorator';

export class CreateItemDto implements TCreateItem {
  @IsNotEmpty()
  @IsTitle()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @IsNotEmpty()
  @IsId()
  type_id: string;

  @IsNotEmpty()
  @IsId()
  brand_id: string;
}
