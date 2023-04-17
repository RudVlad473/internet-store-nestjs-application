import { applyDecorators } from '@nestjs/common';
import { Roles } from '@prisma/client';
import {
  Equals,
  IsAlphanumeric,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { AccessToken } from '../../auth/types/ISignUp';
import { IVerifiable } from '../../auth/types/IVerifiable';

const userNameMinLength = 6;
const passwordMinLength = 6;

export const IsUserName = (): void | any =>
  applyDecorators(IsAlphanumeric(), MinLength(userNameMinLength));

export const IsPassword = (): void | any =>
  applyDecorators(MinLength(passwordMinLength));

export const IsRole = (role?: Roles): void | any =>
  applyDecorators(
    IsString(),
    IsNotEmpty(),
    role ? Equals(role) : IsIn(Object.values(Roles)),
  );

export interface PayloadGoogleUser extends AccessToken, IVerifiable {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;

  email_verified: boolean;
  locale: string;

  access_token: string;
}
