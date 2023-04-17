import { Item } from '@prisma/client';

export type TCreateItem = Omit<Item, 'id' | 'createdAt'>;

export type TCriteria = TCreateItem;
