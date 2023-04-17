import { ForbiddenException, Injectable } from '@nestjs/common';
import { Item } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async create({
    title,
    price,
    brand_id,
    type_id,
    discountPercentage,
  }: CreateItemDto) {
    return await this.prisma.item.create({
      data: {
        title,
        price,
        discountPercentage,
        brand: {
          connect: { id: brand_id },
        },
        type: {
          connect: { id: type_id },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.item.findMany();
  }

  async findById(id: Item['id']) {
    return await this.prisma.item.findUnique({
      where: {
        id,
      },
    });
  }

  async findByTitle(title: Item['title']) {
    return await this.prisma.item.findMany({
      where: { title },
    });
  }

  async update(
    id: Item['id'],
    { title, price, type_id, brand_id, discountPercentage }: UpdateItemDto,
  ) {
    return await this.prisma.item.update({
      data: {
        title,
        price,
        discountPercentage,
        type: type_id
          ? {
              connect: { id: type_id },
            }
          : undefined,
        brand: brand_id
          ? {
              connect: { id: brand_id },
            }
          : undefined,
      },
      where: {
        id,
      },
    });
  }

  async remove(id: Item['id']) {
    try {
      return await this.prisma.item.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new ForbiddenException({ msg: 'Item deletion failed', details: e });
    }
  }
}
