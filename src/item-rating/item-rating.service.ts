import { Injectable } from '@nestjs/common';
import { ItemRating } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PayloadUser } from '../shared/types';
import { CreateItemRatingDto } from './dto/create-item-rating.dto';

@Injectable()
export class ItemRatingService {
  constructor(private prisma: PrismaService) {}

  async create(
    itemId: ItemRating['item_id'],
    { rating }: CreateItemRatingDto,
    user: PayloadUser,
  ) {
    await this.deleteRating(itemId, user.id);

    return await this.prisma.itemRating.create({
      data: {
        rating,
        item: {
          connect: {
            id: itemId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async getAvgRating(itemId: ItemRating['item_id']) {
    return await this.prisma.itemRating.aggregate({
      _avg: {
        rating: true,
      },

      where: {
        item_id: itemId,
      },
    });
  }

  async deleteRating(
    itemId: ItemRating['item_id'],
    userId: PayloadUser['id'],
  ): Promise<ItemRating | null> {
    const rating = await this.prisma.itemRating.findUnique({
      where: {
        user_id_item_id: {
          item_id: itemId,
          user_id: userId,
        },
      },
    });

    if (!rating) {
      return null;
    }

    return await this.prisma.itemRating.delete({
      where: {
        id: rating.id,
      },
    });
  }
}
