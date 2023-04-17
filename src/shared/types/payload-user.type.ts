import { User } from '@prisma/client';

import { IVerifiable } from '../../auth/types';

export type PayloadUser = Pick<User, 'id' | 'role'> & IVerifiable;
