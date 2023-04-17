import { Type } from '@prisma/client';

export type TTypeMock = Omit<Type, 'id'>;
