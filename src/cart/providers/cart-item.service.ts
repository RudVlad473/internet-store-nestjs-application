import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateCartItemDto, UpdateCartItemDto } from '../dto/cart-item';

@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) {}

  async create({ cart_id, item_id }: CreateCartItemDto) {
    return await this.prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            id: cart_id,
          },
        },
        item: {
          connect: {
            id: item_id,
          },
        },
      },
    });
  }

  async update({ id, quantity }: UpdateCartItemDto) {
    return this.prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
    });
  }

  async findByItemId({ cart_id, item_id }: CreateCartItemDto) {
    return await this.prisma.cartItem.findFirst({
      where: {
        cart_id,
        AND: {
          item_id,
        },
      },
    });
  }

  async findAll(cartId: Cart['id']) {
    return await this.prisma.cartItem.findMany({
      where: {
        cart_id: cartId,
      },
    });
  }

  async deleteAll(cartId: Cart['id']) {
    return await this.prisma.cartItem.deleteMany({
      where: {
        cart_id: cartId,
      },
    });
  }

  async delete(itemId: CartItem['id']) {
    return await this.prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });
  }
}
