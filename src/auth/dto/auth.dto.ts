import { User } from '@prisma/client';
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';

type AuthUser = Pick<User, 'email' | 'userName'> & { password: string };

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
