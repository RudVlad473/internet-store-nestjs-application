import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import {
  invalidAuthMock,
  invalidSignInMock,
  properAuthMock,
  properSignInMock,
} from '../src/prisma/initMocks';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthPaths, UserPaths } from '../src/types/enums';
import { AppModule } from './../src/app.module';

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
          .stores('token', 'access_token')
          .inspect();
      });

      it('should NOT sign up', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_UP}`)
          .withBody(invalidAuthMock)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signup admin user', () => {});

      it('should NOT signup admin user', () => {});
    });

    describe('Sign in', () => {
      it('should sign in', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_IN}`)
          .withBody(properSignInMock)
          .expectStatus(HttpStatus.OK)
          .inspect();
      });

      it('should NOT sign in', () => {
        return pactum
          .spec()
          .post(`/${AuthPaths.AUTH}/${AuthPaths.SIGN_IN}`)
          .withBody(invalidSignInMock)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('User', () => {
    describe('Details', () => {
      it('should get own details', () => {
        return pactum
          .spec()
          .get(`/${UserPaths.USER}/${UserPaths.SELF}`)
          .withBearerToken('$S{token}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(properSignInMock.userName)
          .inspect();
      });

      it('should get user details by username', () => {
        return pactum
          .spec()
          .get(`/${UserPaths.USER}/{${UserPaths.USERNAME}}`)
          .withPathParams(UserPaths.USERNAME, properSignInMock.userName)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(properSignInMock.userName)
          .inspect();
      });
    });

    describe('Edit', () => {});

    describe('Delete', () => {});
  });

  describe('Miscellaneous', () => {
    describe('Brand', () => {
      it('should create brand', () => {});
      it('should delete brand', () => {});
      it('should update brand', () => {});
      it('should get brand', () => {});
    });

    describe('Category', () => {
      it('should create category', () => {});
      it('should delete category', () => {});
      it('should update category', () => {});
      it('should get category', () => {});
    });

    describe('Type', () => {
      it('should create type', () => {});
      it('should delete type', () => {});
      it('should update type', () => {});
      it('should get type', () => {});
    });
  });

  describe('Item', () => {
    describe('Create', () => {
      it('should create product', () => {});
    });
  });

  describe('Reactions', () => {});

  describe('Cart', () => {});

  describe('Comment', () => {});
});
