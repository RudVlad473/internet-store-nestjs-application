import { AuthUser, SignInDto } from '../../auth/dto';

export const properAuthMock: AuthUser = {
  email: 'mock123@test.com',
  userName: 'JohnTheMocking123',
  password: 'test_test',
};

export const invalidAuthMock: AuthUser = {
  email: '',
  userName: '_   a',
  password: '',
};

export const properSignInMock: SignInDto = {
  ...properAuthMock,
  email: undefined,
};

export const invalidSignInMock: SignInDto = {
  ...invalidAuthMock,
  userName: '',
};
