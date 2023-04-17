import { User } from '@prisma/client';

import { IsUserName } from '../types';

export class GetUserDto implements Pick<User, 'userName'> {
  @IsUserName()
  userName: string;
}
