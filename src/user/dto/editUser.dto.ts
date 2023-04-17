import { User } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsUserName } from '../types';

type EditUserDtoType = Pick<User, 'userName'>;

export class EditUserDto implements EditUserDtoType {
  @IsUserName()
  @IsNotEmpty()
  userName: string;
}
