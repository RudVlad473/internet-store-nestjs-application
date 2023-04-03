import { User } from '@prisma/client';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export type AuthUser = Pick<User, 'email' | 'userName'> & { password: string };

export class AuthDto implements AuthUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDto implements AuthUser {
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsOptional()
  @IsAlphanumeric()
  userName: string | undefined;

  @IsString()
  @IsNotEmpty()
  password: string;
}
