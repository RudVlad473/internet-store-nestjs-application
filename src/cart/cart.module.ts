import { Module } from '@nestjs/common';

import { CartController } from './cart.controller';
import { CartItemService } from './providers/cart-item.service';
import { CartService } from './providers/cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartItemService],
})
export class CartModule {}
