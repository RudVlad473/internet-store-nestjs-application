import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { FirstLevelPaths, Paths } from '../src/enums';
import {
  invalidAuthMock,
  invalidSignInMock,
  properAuthMock,
  properSignInMock,
} from '../src/prisma/initMocks';
import { HttpStatus } from '@nestjs/common';

const PORT = process.env.PORT;

describe('App (e2e)', () => {
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

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Sign up', () => {
      it('should sign up', () => {
        return pactum
          .spec()
          .post(`/${FirstLevelPaths.AUTH}/${Paths.SIGN_UP}`)
          .withBody(properAuthMock)
          .expectStatus(HttpStatus.CREATED)
          .inspect();
      });

      it('should NOT sign up', () => {
        return pactum
          .spec()
          .post(`/${FirstLevelPaths.AUTH}/${Paths.SIGN_UP}`)
          .withBody(invalidAuthMock)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Sign in', () => {
      it('should sign in', () => {
        return pactum
          .spec()
          .post(`/${FirstLevelPaths.AUTH}/${Paths.SIGN_IN}`)
          .withBody(properSignInMock)
          .expectStatus(HttpStatus.OK)
          .inspect();
      });

      it('should NOT sign in', () => {
        return pactum
          .spec()
          .post(`/${FirstLevelPaths.AUTH}/${Paths.SIGN_IN}`)
          .withBody(invalidSignInMock)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('User', () => {});

  describe('Item', () => {});

  describe('Cart', () => {});

  describe('Comment', () => {});
});
