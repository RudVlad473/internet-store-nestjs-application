import { Injectable } from '@nestjs/common';
import { PrismaClient, Roles } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  cleanDb() {
    this.$transaction([
      this.cart.deleteMany(),
      this.itemRating.deleteMany(),
      this.commentRating.deleteMany(),
      this.comment.deleteMany({
        where: {
          parentId: {
            not: null,
          },
        },
      }),
      this.comment.deleteMany(),
      this.item.deleteMany(),
      this.cartItem.deleteMany(),
      this.user.deleteMany({
        where: {
          role: Roles.DEFAULT,
        },
      }),
      this.type.deleteMany(),
      this.category.deleteMany(),
      this.brand.deleteMany(),
    ]);
  }
}
