import { ForbiddenException, Injectable } from '@nestjs/common';
import { Brand } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    return await this.prisma.brand.create({
      data: createBrandDto,
    });
  }

  async find(name: Brand['name']) {
    return await this.prisma.brand.findUnique({
      where: {
        name,
      },
    });
  }

  async findAll() {
    return await this.prisma.brand.findMany();
  }

  async update(name: Brand['name'], updateBrandDto: UpdateBrandDto) {
    return await this.prisma.brand.update({
      where: {
        name,
      },
      data: updateBrandDto,
    });
  }

  async remove(name: Brand['name']) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        name,
      },
    });
    if (!brand) {
      throw new ForbiddenException('Such brand was not found');
    }
    return this.prisma.brand.delete({
      where: {
        id: brand.id,
      },
    });
  }
}
