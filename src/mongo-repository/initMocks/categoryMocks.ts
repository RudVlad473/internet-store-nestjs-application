import { Category } from '@prisma/client';
import { ObjectId } from 'bson';

enum TCategories {
  HEADPHONES = 'Наушники',
  MONITORS = 'Мониторы',
  PHONES = 'Смартфоны',
}

export const type1Mock: Category = {
  id: new ObjectId().toString(),
  name: TCategories.HEADPHONES,
};
export const type2Mock: Category = {
  id: new ObjectId().toString(),
  name: TCategories.MONITORS,
};
export const type3Mock: Category = {
  id: new ObjectId().toString(),
  name: TCategories.PHONES,
};
