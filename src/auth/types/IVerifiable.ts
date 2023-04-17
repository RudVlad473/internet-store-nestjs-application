import { User } from '@prisma/client';

export interface IVerifiable extends Pick<User, 'email'> {}
