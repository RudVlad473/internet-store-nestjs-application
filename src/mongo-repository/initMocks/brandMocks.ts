import { Brand } from '@prisma/client';
import { ObjectId } from 'bson';

export const brand1Mock: Brand = {
  id: new ObjectId().toString(),
  name: 'Samsung',
  websiteUrl: 'samsung.com',
};

export const brand2Mock: Brand = {
  id: new ObjectId().toString(),
  name: 'Lenovo',
  websiteUrl: 'lenovo.com',
};

export const brand3Mock: Brand = {
  id: new ObjectId().toString(),
  name: 'Sony',
  websiteUrl: 'sony.com',
};
