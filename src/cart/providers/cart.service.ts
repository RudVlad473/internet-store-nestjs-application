import { Injectable } from '@nestjs/common';
import { Cart, CartItem, Item } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { TCartAction } from '../../shared/types/enums';
import { UpdateItemDto } from '../dto/cart';
import { AddItemDto } from '../dto/cart/create-cart.dto';
import { CartItemService } from './cart-item.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private cartItemService: CartItemService,
  ) {}

  async addItem({ item_id }: AddItemDto, userId: string) {
    const item = await this.prisma.item.findUnique({
      where: {
        id: item_id,
      },
    });

    if (!item) {
      throw new Error('Such item does not exist');
    }

    const cart = await this.findByUserId(userId);

    const payload = {
      cart_id: cart.id,
      item_id: item.id,
    };

    const isItemAlreadyInCart =
      (await this.cartItemService.findByItemId(payload)) !== null;

    if (isItemAlreadyInCart) {
      return this.updateItem(item.id, { action: TCartAction.INC }, userId);
    }

    return await this.cartItemService.create(payload);
  }

  async updateItem(
    itemId: CartItem['item_id'],
    updateItemDto: UpdateItemDto,
    userId: string,
  ) {
    const cart = await this.findByUserId(userId);

    const cartItem = await this.cartItemService.findByItemId({
      cart_id: cart.id,
      item_id: itemId,
    });

    const action = updateItemDto.action;

    const quantity =
      action === TCartAction.INC
        ? cartItem.quantity + 1
        : cartItem.quantity - 1;

    return await this.cartItemService.update({
      id: cartItem.id,
      quantity,
    });
  }

  async findByUserId(userId: Cart['user_id']) {
    return await this.prisma.cart.findUnique({
      where: {
        user_id: userId,
      },
    });
  }

  async getAllItems(userId: string) {
    const cart = await this.findByUserId(userId);

    return await this.cartItemService.findAll(cart.id);
  }

  async empty(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        user_id: userId,
      },
    });

    return await this.cartItemService.deleteAll(cart.id);
  }

  async removeItem(itemId: Item['id'], userId: string) {
    const cart = await this.findByUserId(userId);

    const cartItem = await this.cartItemService.findByItemId({
      cart_id: cart.id,
      item_id: itemId,
    });

    return await this.cartItemService.delete(cartItem.id);
  }
}
