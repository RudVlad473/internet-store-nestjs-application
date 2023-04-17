import { CartItem } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsId } from '../decorator';

export class ItemIdDto implements Pick<CartItem, 'item_id'> {
  @IsNotEmpty()
  @IsId()
  item_id: string;
}
