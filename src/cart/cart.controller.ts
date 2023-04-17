import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartItem } from '@prisma/client';

import { User } from '../auth/decorator';
import { DefaultGuard, FinalGuard } from '../auth/guard';
import { CartPaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { UpdateItemDto } from './dto/cart';
import { AddItemDto } from './dto/cart/create-cart.dto';
import { CartService } from './providers/cart.service';

@UseGuards(FinalGuard, DefaultGuard)
@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addItem(@Body() addItemDto: AddItemDto, @User('sub') userId: string) {
    return this.cartService.addItem(addItemDto, userId);
  }

  @Patch(dynamic(CartPaths.BY_ITEM_ID))
  updateItem(
    @Param(CartPaths.BY_ITEM_ID) itemId: CartItem['item_id'],
    @User('sub') userId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(itemId, updateItemDto, userId);
  }

  @Get()
  getAllItems(@User('sub') userId: string) {
    return this.cartService.getAllItems(userId);
  }

  @Delete()
  empty(@User('sub') userId: string) {
    return this.cartService.empty(userId);
  }

  @Delete(dynamic(CartPaths.BY_ITEM_ID))
  removeItem(
    @Param(CartPaths.BY_ITEM_ID) itemId: CartItem['item_id'],
    @User('sub') userId: string,
  ) {
    return this.cartService.removeItem(itemId, userId);
  }
}
