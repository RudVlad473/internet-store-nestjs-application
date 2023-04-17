import { ForbiddenException, Injectable } from '@nestjs/common';
import { Type } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypeService {
  constructor(private prisma: PrismaService) {}

  async create({ name, category_id }: CreateTypeDto) {
    return await this.prisma.type.create({
      data: {
        name,
        category: {
          connect: {
            id: category_id,
          },
        },
      },
    });
  }

  async find(name: Type['name']) {
    return await this.prisma.type.findUnique({
      where: {
        name,
      },
    });
  }

  async findAll() {
    return await this.prisma.type.findMany();
  }

  async update(name: Type['name'], updateTypeDto: UpdateTypeDto) {
    return await this.prisma.type.update({
      where: {
        name,
      },
      data: {
        name: updateTypeDto.name,
      },
    });
  }

  async remove(name: Type['name']) {
    const type = await this.prisma.type.findUnique({
      where: {
        name,
      },
    });

    if (!type) {
      throw new ForbiddenException('Such type was not found');
    }
    try {
      return this.prisma.type.delete({
        where: {
          id: type.id,
        },
      });
    } catch (e) {
      throw new ForbiddenException(
        'Type deletion failed. Probable reason: it has relations',
      );
    }
  }
}
