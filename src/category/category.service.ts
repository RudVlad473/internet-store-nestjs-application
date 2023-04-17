import { ForbiddenException, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async find(name: Category['name']) {
    return await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async update(name: Category['name'], updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: {
        name,
      },
      data: updateCategoryDto,
    });
  }

  async remove(name: Category['name']) {
    const category = await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
    if (!category) {
      throw new ForbiddenException('Such category was not found');
    }
    return this.prisma.category.delete({
      where: {
        id: category.id,
      },
    });
  }
}
