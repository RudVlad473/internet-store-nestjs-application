import { CartItem } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsId } from '../../../shared/decorator';

export class AddItemDto implements Pick<CartItem, 'item_id'> {
  @IsNotEmpty()
  @IsId()
  item_id: string;
}
