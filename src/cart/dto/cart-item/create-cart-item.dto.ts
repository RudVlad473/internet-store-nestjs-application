import { CartItem } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsId } from '../../../shared/decorator';

export class CreateCartItemDto implements Omit<CartItem, 'id' | 'quantity'> {
  @IsNotEmpty()
  @IsId()
  cart_id: string;

  @IsNotEmpty()
  @IsId()
  item_id: string;
}
