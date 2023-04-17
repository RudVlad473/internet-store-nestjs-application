import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { CommentReactionModule } from './comment-reaction/comment-reaction.module';
import { CommentsModule } from './comments/comments.module';
import { ItemRatingModule } from './item-rating/item-rating.module';
import { ItemModule } from './item/item.module';
import { PrismaModule } from './prisma/prisma.module';
import {
  AuthPaths,
  BrandPaths,
  CartPaths,
  CategoryPaths,
  CommentPaths,
  ItemPaths,
  TypePaths,
  UserPaths,
} from './shared/types/paths';
import { TypeModule } from './type/type.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RouterModule.register([
      {
        path: AuthPaths.AUTH,
        module: AuthModule,
      },
      {
        path: UserPaths.USER,
        module: UserModule,
      },
      {
        path: BrandPaths.BRAND,
        module: BrandModule,
      },
      {
        path: CategoryPaths.CATEGORY,
        module: CategoryModule,
      },
      {
        path: TypePaths.TYPE,
        module: TypeModule,
      },
      {
        path: ItemPaths.ITEM,
        module: ItemModule,
      },
      {
        path: CartPaths.CART,
        module: CartModule,
      },
      {
        path: CommentPaths.COMMENT,
        module: CommentsModule,
      },
      {
        path: `${ItemPaths.ITEM}/${ItemPaths.RATING}`,
        module: ItemRatingModule,
      },
      {
        path: `${CommentPaths.COMMENT}/${CommentPaths.REACTION}`,
        module: CommentReactionModule,
      },
    ]),
    BrandModule,
    UserModule,
    CategoryModule,
    TypeModule,
    ItemModule,
    CartModule,
    CommentsModule,
    ItemRatingModule,
    CommentReactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RoleMiddleware).forRoutes(BrandPaths.BRAND);
  // }
}
