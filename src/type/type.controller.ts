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
import { Type } from '@prisma/client';

import { AdminGuard, FinalGuard } from '../auth/guard';
import { TypePaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TypeService } from './type.service';

@UseGuards(FinalGuard, AdminGuard)
@Controller()
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  createOne(@Body() createCategoryDto: CreateTypeDto) {
    return this.typeService.create(createCategoryDto);
  }

  @Get(dynamic(TypePaths.BY_TYPE))
  find(@Param(TypePaths.BY_TYPE) name: Type['name']) {
    return this.typeService.find(name);
  }

  @Get()
  findAll() {
    return this.typeService.findAll();
  }

  @Patch(dynamic(TypePaths.BY_TYPE))
  update(
    @Param(TypePaths.BY_TYPE) name: Type['name'],
    @Body() updateCategoryDto: UpdateTypeDto,
  ) {
    return this.typeService.update(name, updateCategoryDto);
  }

  @Delete(dynamic(TypePaths.BY_TYPE))
  remove(@Param(TypePaths.BY_TYPE) name: Type['name']) {
    return this.typeService.remove(name);
  }
}
