import { User } from '@prisma/client';
import { IsAlphanumeric, IsString } from 'class-validator';

export class GetUserDto implements Pick<User, 'userName'> {
  @IsString()
  @IsAlphanumeric()
  userName: string;
}
