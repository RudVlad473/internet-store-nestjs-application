import { CartItem } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsId } from '../../../shared/decorator';
import { IsQuantity } from '../../decorator/cart-item';

export class UpdateCartItemDto implements Pick<CartItem, 'id' | 'quantity'> {
  @IsNotEmpty()
  @IsId()
  id: string;

  @IsQuantity()
  @IsNotEmpty()
  quantity: number;
}
