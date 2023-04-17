import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Category } from '@prisma/client';

import { AdminGuard, FinalGuard } from '../auth/guard';
import { CategoryPaths } from '../shared/types/paths';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(FinalGuard, AdminGuard)
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createOne(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get(`:${CategoryPaths.BY_CATEGORY}`)
  find(@Param(CategoryPaths.BY_CATEGORY) name: Category['name']) {
    return this.categoryService.find(name);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Patch(`:${CategoryPaths.BY_CATEGORY}`)
  update(
    @Param(CategoryPaths.BY_CATEGORY) name: Category['name'],
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(name, updateCategoryDto);
  }

  @Delete(`:${CategoryPaths.BY_CATEGORY}`)
  remove(@Param(CategoryPaths.BY_CATEGORY) name: Category['name']) {
    return this.categoryService.remove(name);
  }
}
