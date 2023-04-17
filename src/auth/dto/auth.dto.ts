import { Roles, User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsPassword, IsRole } from '../../user/types';
import { IsUserName } from '../decorator';

export type AuthUser = Pick<User, 'email' | 'userName'> & {
  password: string;
};

export type SignUpUser = Pick<User, 'email' | 'userName'> & {
  password: string;
};

export class AuthDto implements SignUpUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUserName()
  @IsNotEmpty()
  userName: string;

  @IsPassword()
  @IsNotEmpty()
  password: string;
}

export class SignInDto implements AuthUser {
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsOptional()
  @IsUserName()
  userName: string | undefined;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AdminDto implements SignUpUser {
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsOptional()
  @IsUserName()
  userName: string | undefined;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsRole('ADMIN')
  role: Roles;
}

export class SignInAdminDto implements AuthUser {
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsOptional()
  @IsUserName()
  userName: string | undefined;

  @IsString()
  @IsNotEmpty()
  password: string;
}
