import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  Brand,
  CartItem,
  Category,
  Comment,
  CommentRating,
  ItemRating,
  Type,
} from '@prisma/client';
import * as pactum from 'pactum';

import { CreateCommentDto } from '../src/comments/dto/create-comment.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  TCreateItem,
  invalidAdminMock,
  invalidAuthMock,
  invalidSignInMock,
  properAdminMock,
  properAuthMock,
  properSignInMock,
} from '../src/shared/test/initMocks';
import { TTypeMock } from '../src/shared/test/initMocks/typeMocks';
import { CartAction, TCartAction } from '../src/shared/types/enums';
import {
  AuthPaths,
  BrandPaths,
  CartPaths,
  CategoryPaths,
  CommentPaths,
  ItemPaths,
  TypePaths,
  UserPaths,
} from '../src/shared/types/paths';
import { generateRandomString } from '../src/shared/utils';
import { AppModule } from './../src/app.module';
import { encodeUriHandler } from './pactum/handlers';

const PORT = process.env.PORT;

describe('App => e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(PORT);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  afterAll(async () => {
    await prisma.cleanDb();

    app.close();
  });

  describe('Auth', () => {
    describe('Sign up', () => {
      it('should sign up', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_UP}`)
          .withBody(properAuthMock)
          .expectStatus(HttpStatus.CREATED)
          .stores('userId', 'id')
          .stores('token', 'access_token');
      });

      it('should NOT sign up', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_UP}`)
          .withBody(invalidAuthMock)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signup admin user', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_UP}`)
          .withBody(properAdminMock)
          .expectStatus(HttpStatus.CREATED)
          .stores('admin_token', 'access_token');
      });

      it('should NOT signup admin user', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_UP}`)
          .withBody(invalidAdminMock)
          .expectStatus(HttpStatus.FORBIDDEN);
      });
    });

    describe('Sign in', () => {
      it('should sign in', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_IN}`)
          .withBody(properSignInMock)
          .expectStatus(HttpStatus.OK);
      });

      it('should NOT sign in', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_IN}`)
          .withBody(invalidSignInMock)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signin admin user', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_IN}`)
          .withBody(properAdminMock)
          .expectStatus(HttpStatus.OK);
      });

      it('should NOT signin admin user', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_IN}`)
          .withBody(invalidAdminMock)
          .expectStatus(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('User', () => {
    describe('Details', () => {
      it('should get own details', () => {
        return pactum
          .spec()
          .get(`/${UserPaths.USER}`)
          .withBearerToken('$S{token}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(properSignInMock.userName);
      });

      it('should get user details by username', () => {
        return pactum
          .spec()
          .get(`/${UserPaths.USER}/{${UserPaths.USERNAME}}`)
          .withPathParams(UserPaths.USERNAME, properSignInMock.userName)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(properSignInMock.userName);
      });
    });

    describe('Edit', () => {});

    describe('Delete', () => {});
  });

  describe('Miscellaneous', () => {
    describe('Brand', () => {
      it('should create brand', () => {
        const brand = generateRandomString('brand');

        const brandMock: Omit<Brand, 'id'> = {
          name: brand,
          websiteUrl: `www.${brand}.com`,
        };

        return pactum
          .spec()
          .post(`/${BrandPaths.BRAND}`)
          .withBody(brandMock)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(brandMock.name)

          .stores('brand', 'name');
      });

      it('should get all brands', () => {
        return pactum
          .spec()
          .get(`/${BrandPaths.BRAND}`)
          .withBearerToken('$S{admin_token}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{brand}')
          .expectJsonLength(1);
      });

      it('should get brand by name', () => {
        return pactum
          .spec()
          .get(`/${BrandPaths.BRAND}/{${BrandPaths.BY_BRAND}}`)
          .withPathParams(BrandPaths.BY_BRAND, '$S{brand}')
          .withBearerToken('$S{admin_token}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{brand}');
      });

      it('should update brand', () => {
        const updateBrandMock: Partial<Omit<Brand, 'id'>> = {
          name: generateRandomString('brand'),
        };

        return pactum
          .spec()
          .patch(`/${BrandPaths.BRAND}/{${BrandPaths.BY_BRAND}}`)
          .withPathParams(BrandPaths.BY_BRAND, '$S{brand}')
          .withBody(updateBrandMock)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(updateBrandMock.name)

          .stores('brand', 'name');
      });

      it('should delete brand', () => {
        return pactum
          .spec()
          .delete(`/${BrandPaths.BRAND}/{${BrandPaths.BY_BRAND}}`)
          .withPathParams(BrandPaths.BY_BRAND, '$S{brand}')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Category', () => {
      it('should create category', () => {
        const categoryMock: Omit<Category, 'id'> = {
          name: generateRandomString(),
        };

        return pactum
          .spec()
          .post(`/${CategoryPaths.CATEGORY}`)
          .withBody(categoryMock)

          .stores('category', 'name')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains('$S{category}');
      });

      it('should get all categories', () => {
        return pactum
          .spec()
          .get(`/${CategoryPaths.CATEGORY}`)
          .withBearerToken('$S{admin_token}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{category}')
          .expectJsonLength(1);
      });

      it('should get category by name', () => {
        return pactum
          .spec()
          .get(`/${CategoryPaths.CATEGORY}/{${CategoryPaths.BY_CATEGORY}}`)
          .withPathParams(CategoryPaths.BY_CATEGORY, '$S{category}')
          .withBearerToken('$S{admin_token}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{category}');
      });

      it('should update category', () => {
        const updateCategoryMock: Omit<Category, 'id'> = {
          name: generateRandomString(),
        };

        return pactum
          .spec()
          .patch(`/${CategoryPaths.CATEGORY}/{${CategoryPaths.BY_CATEGORY}}`)
          .withPathParams(CategoryPaths.BY_CATEGORY, '$S{category}')
          .withBody(updateCategoryMock)

          .stores('category', 'name')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(updateCategoryMock.name);
      });

      it('should delete category', () => {
        return pactum
          .spec()
          .delete(`/${CategoryPaths.CATEGORY}/{${CategoryPaths.BY_CATEGORY}}`)
          .withPathParams(CategoryPaths.BY_CATEGORY, '$S{category}')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Type', () => {
      it('should create type', async () => {
        const category = await prisma.category.create({
          data: {
            name: generateRandomString('category'),
          },
        });
        const typeMock: TTypeMock = {
          name: generateRandomString('type'),
          category_id: category.id,
        };

        return pactum
          .spec()
          .post(`/${TypePaths.TYPE}`)
          .withBody(typeMock)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(typeMock.name)

          .stores('type', 'name');
      });

      it('should get all types', () => {
        return pactum
          .spec()
          .get(`/${TypePaths.TYPE}`)
          .withBearerToken('$S{admin_token}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{type}')
          .expectJsonLength(1);
      });

      it('should get type by name', () => {
        return pactum
          .spec()
          .get(`/${TypePaths.TYPE}/{${TypePaths.BY_TYPE}}`)
          .withPathParams(TypePaths.BY_TYPE, '$S{type}')
          .withBearerToken('$S{admin_token}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{type}');
      });

      it('should update type', () => {
        const updateTypeMock: Partial<Omit<Type, 'id'>> = {
          name: generateRandomString('updateType'),
        };

        return pactum
          .spec()
          .patch(`/${TypePaths.TYPE}/{${TypePaths.BY_TYPE}}`)
          .withPathParams(TypePaths.BY_TYPE, '$S{type}')
          .withBody(updateTypeMock)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(updateTypeMock.name)

          .stores('type', 'name');
      });

      it('should delete type', () => {
        return pactum
          .spec()
          .delete(`/${TypePaths.TYPE}/{${TypePaths.BY_TYPE}}`)
          .withPathParams(TypePaths.BY_TYPE, '$S{type}')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('Item', () => {
    const encodeUriTitle = encodeUriHandler('title');

    describe('Create', () => {
      it('should create item', async () => {
        const brandName = generateRandomString('brand');

        const brand = await prisma.brand.create({
          data: {
            name: brandName,
            websiteUrl: `www.${brandName}.com`,
          },
        });

        const category = await prisma.category.create({
          data: {
            name: generateRandomString('category'),
          },
        });

        const type = await prisma.type.create({
          data: {
            name: generateRandomString('type'),
            category: {
              connect: {
                id: category.id,
              },
            },
          },
        });

        const itemMock: TCreateItem = {
          title: 'Laptop 9999',
          price: 9999.99,
          discountPercentage: 10,
          type_id: type.id,
          brand_id: brand.id,
        };

        return pactum
          .spec()
          .post(`/${ItemPaths.ITEM}`)
          .withBody(itemMock)

          .stores('id', 'id')
          .stores('title', encodeUriTitle)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(itemMock.title);
      });

      it('should NOT create item', () => {
        const itemMock: Partial<TCreateItem> = {
          title: generateRandomString(),
          discountPercentage: 0,
          price: 666,
          brand_id: '',
          type_id: '',
        };

        return pactum
          .spec()
          .post(`/${ItemPaths.ITEM}`)
          .withBody(itemMock)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Get', () => {
      it('should get item by id', () => {
        return pactum
          .spec()
          .get(`/${ItemPaths.ITEM}/{${ItemPaths.BY_ID}}`)
          .withPathParams(ItemPaths.BY_ID, '$S{id}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{id}');
      });

      it('should get all items', () => {
        return pactum
          .spec()
          .get(`/${ItemPaths.ITEM}`)

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{id}')
          .expectJsonLength(1);
      });
    });

    describe('Update', () => {
      it('should update item by id', () => {
        const updateItemMock: Partial<TCreateItem> = {
          price: 10000,
        };

        return pactum
          .spec()
          .patch(`/${ItemPaths.ITEM}/{${ItemPaths.BY_ID}}`)
          .withPathParams(ItemPaths.BY_ID, '$S{id}')
          .withBody(updateItemMock)

          .stores('id', 'id')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{id}');
      });

      it('should NOT update item by id', () => {
        const updateItemMock: Partial<TCreateItem> = {
          brand_id: '',
        };

        return pactum
          .spec()
          .patch(`/${ItemPaths.ITEM}/{${ItemPaths.BY_ID}}`)
          .withPathParams(ItemPaths.BY_ID, '$S{id}')
          .withBody(updateItemMock)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Delete', () => {
      it('should delete item by id', () => {
        return pactum
          .spec()
          .delete(`/${ItemPaths.ITEM}/{${ItemPaths.BY_ID}}`)
          .withPathParams(ItemPaths.BY_ID, '$S{id}')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('Cart', () => {
    it('should add item', async () => {
      const brandName = generateRandomString('brand');

      const [brand, category] = await Promise.all([
        await prisma.brand.create({
          data: {
            name: brandName,
            websiteUrl: `www.${brandName}.com`,
          },
        }),
        await prisma.category.create({
          data: {
            name: generateRandomString('category'),
          },
        }),
      ]);

      const type = await prisma.type.create({
        data: {
          name: generateRandomString('type'),
          category: {
            connect: {
              id: category.id,
            },
          },
        },
      });

      const itemMock: TCreateItem = {
        title: generateRandomString('item'),
        price: 9999.99,
        discountPercentage: 10,
        type_id: type.id,
        brand_id: brand.id,
      };

      const item = await prisma.item.create({
        data: itemMock,
      });

      const cartItemMock: Omit<CartItem, 'id' | 'quantity' | 'cart_id'> = {
        item_id: item.id,
      };

      return pactum
        .spec()
        .post(`/${CartPaths.CART}`)
        .withBody(cartItemMock)

        .withBearerToken('$S{token}')
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(cartItemMock.item_id)

        .stores('item_id', 'item_id');
    });

    it('should increment item', () => {
      const patchItemProps: CartAction = {
        action: TCartAction.INC,
      };

      return pactum
        .spec()
        .patch(`/${CartPaths.CART}/{${CartPaths.BY_ITEM_ID}}`)
        .withPathParams(CartPaths.BY_ITEM_ID, '$S{item_id}')
        .withBody(patchItemProps)

        .withBearerToken('$S{token}')
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('$S{item_id}');
    });

    it('should decrement item', () => {
      const patchItemProps: CartAction = {
        action: TCartAction.DEC,
      };

      return pactum
        .spec()
        .patch(`/${CartPaths.CART}/{${CartPaths.BY_ITEM_ID}}`)
        .withPathParams(CartPaths.BY_ITEM_ID, '$S{item_id}')
        .withBody(patchItemProps)

        .withBearerToken('$S{token}')
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('$S{item_id}');
    });

    it('should get all items', () => {
      return pactum
        .spec()
        .get(`/${CartPaths.CART}`)

        .withBearerToken('$S{token}')
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('$S{item_id}')
        .expectJsonLength(1);
    });

    it('should delete item', () => {
      return pactum
        .spec()
        .delete(`/${CartPaths.CART}/{${CartPaths.BY_ITEM_ID}}`)
        .withPathParams(CartPaths.BY_ITEM_ID, '$S{item_id}')

        .withBearerToken('$S{token}')
        .expectStatus(HttpStatus.OK);
    });

    it('should empty cart', () => {
      return pactum
        .spec()
        .delete(`/${CartPaths.CART}`)

        .withBearerToken('$S{token}')
        .expectStatus(HttpStatus.OK);
    });
  });

  describe('Comment', () => {
    describe('Create', () => {
      it('should create comment', async () => {
        const commentMock: CreateCommentDto = {
          content: generateRandomString('comment', 50),
          item_id: '$S{item_id}',
        };

        return pactum
          .spec()
          .post(`/${CommentPaths.COMMENT}`)
          .withBody(commentMock)

          .withBearerToken('$S{token}')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(commentMock.content)

          .stores('comment_id', 'id');
      });

      it('should create reply', () => {
        const replyMock: Pick<Comment, 'content' | 'item_id'> = {
          content: generateRandomString('reply', 20),
          item_id: '$S{item_id}',
        };

        return pactum
          .spec()
          .post(`/${CommentPaths.COMMENT}/{${CommentPaths.BY_PARENT_ID}}`)
          .withPathParams(CommentPaths.BY_PARENT_ID, '$S{comment_id}')
          .withBody(replyMock)

          .withBearerToken('$S{token}')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(replyMock.content)

          .stores('reply_id', 'id');
      });
    });

    describe('Get', () => {
      it('should get all comments by item id', () => {
        return pactum
          .spec()
          .get(`/${CommentPaths.COMMENT}`)
          .withBody({
            itemId: '$S{item_id}',
          })

          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{item_id}')
          .expectJsonLength(2);
      });
    });

    describe('Edit', () => {
      it('should NOT edit content', () => {
        const updateCommentMock: Pick<Comment, 'content'> = {
          content: generateRandomString('updatedComment', 40),
        };

        return pactum
          .spec()
          .patch(`/${CommentPaths.COMMENT}/{${CommentPaths.BY_ID}}`)
          .withPathParams(CommentPaths.BY_ID, '$S{comment_id}')
          .withBody(updateCommentMock)

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.FORBIDDEN)
          .inspect();
      });

      it('should edit content', () => {
        const updateCommentMock: Pick<Comment, 'content'> = {
          content: generateRandomString('updatedComment', 40),
        };

        return pactum
          .spec()
          .patch(`/${CommentPaths.COMMENT}/{${CommentPaths.BY_ID}}`)
          .withPathParams(CommentPaths.BY_ID, '$S{comment_id}')
          .withBody(updateCommentMock)

          .withBearerToken('$S{token}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(updateCommentMock.content)
          .inspect();
      });
    });

    describe('Delete', () => {
      it('should NOT delete comment by id', () => {
        return pactum
          .spec()
          .delete(`/${CommentPaths.COMMENT}/{${CommentPaths.BY_ID}}`)
          .withPathParams(CommentPaths.BY_ID, '$S{comment_id}')

          .withBearerToken('$S{admin_token}')
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it('should delete comment by id', () => {
        return pactum
          .spec()
          .delete(`/${CommentPaths.COMMENT}/{${CommentPaths.BY_ID}}`)
          .withPathParams(CommentPaths.BY_ID, '$S{comment_id}')

          .withBearerToken('$S{token}')
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('Ratings', () => {
    describe('Item rating', () => {
      const itemRatingPath = `/${ItemPaths.ITEM}/${ItemPaths.RATING}/{${ItemPaths.BY_ID}}`;

      const itemRating = 4;

      it('should put rating on item', () => {
        const ratingMock: Pick<ItemRating, 'rating'> = {
          rating: 3,
        };

        return pactum
          .spec()
          .post(itemRatingPath)
          .withPathParams(ItemPaths.BY_ID, '$S{item_id}')
          .withBody(ratingMock)
          .withBearerToken('$S{token}')

          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(ratingMock.rating);
      });

      it('should edit rating on item', () => {
        const updateRatingMock: Pick<ItemRating, 'rating'> = {
          rating: itemRating,
        };

        return pactum
          .spec()
          .post(itemRatingPath)
          .withPathParams(ItemPaths.BY_ID, '$S{item_id}')
          .withBody(updateRatingMock)
          .withBearerToken('$S{token}')

          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(updateRatingMock.rating);
      });

      it('should get average item rating by item_id', () => {
        return pactum
          .spec()
          .get(itemRatingPath)
          .withPathParams(ItemPaths.BY_ID, '$S{item_id}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains(itemRating);
      });
    });

    describe('Comment reaction', () => {
      const commentReactionPath = `/${CommentPaths.COMMENT}/${CommentPaths.REACTION}/{${CommentPaths.BY_ID}}`;

      it('should like comment', () => {
        const reactionMock: Pick<CommentRating, 'reaction'> = {
          reaction: 'LIKE',
        };

        return pactum
          .spec()
          .post(commentReactionPath)
          .withPathParams(CommentPaths.BY_ID, '$S{comment_id}')
          .withBody(reactionMock)
          .withBearerToken('$S{token}')

          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(reactionMock.reaction);
      });

      it('should dislike comment', () => {
        const reactionMock: Pick<CommentRating, 'reaction'> = {
          reaction: 'DISLIKE',
        };

        return pactum
          .spec()
          .post(commentReactionPath)
          .withPathParams(CommentPaths.BY_ID, '$S{comment_id}')
          .withBody(reactionMock)
          .withBearerToken('$S{token}')

          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(reactionMock.reaction)

          .stores('comment_reaction_id', 'id');
      });

      it('should get sum of likes and dislikes by comment_id', () => {
        return pactum
          .spec()
          .get(commentReactionPath)
          .withPathParams(CommentPaths.BY_ID, '$S{comment_id}')

          .expectStatus(HttpStatus.OK)
          .expectBodyContains(-1);
      });
    });
  });
});
