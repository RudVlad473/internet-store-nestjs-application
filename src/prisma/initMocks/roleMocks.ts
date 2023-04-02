import { Role } from '@prisma/client';
import { ObjectId } from 'bson';

const enum TRole {
  USER = 'user',
  ADMIN = 'admin',
}

export const roleUser: Role = {
  id: new ObjectId().toString(),
  name: TRole.USER,
};

export const roleAdmin: Role = {
  id: new ObjectId().toString(),
  name: TRole.ADMIN,
};
