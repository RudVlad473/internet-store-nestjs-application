import { ItemRating } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsRating } from '../decorator';

export class CreateItemRatingDto implements Pick<ItemRating, 'rating'> {
  @IsNotEmpty()
  @IsRating()
  rating: number;
}
