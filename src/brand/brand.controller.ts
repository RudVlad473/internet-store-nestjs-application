import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Brand, Roles } from '@prisma/client';

import { UseAuthRole } from '../auth/decorator/use-role.decorator';
import { BrandPaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

//@UseGuards(FinalGuard, AdminGuard)
@UseAuthRole(Roles.ADMIN)
@Controller()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  createOne(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get(dynamic(BrandPaths.BY_BRAND))
  find(@Param(BrandPaths.BY_BRAND) name: Brand['name']) {
    return this.brandService.find(name);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Patch(dynamic(BrandPaths.BY_BRAND))
  update(
    @Param(BrandPaths.BY_BRAND) name: Brand['name'],
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandService.update(name, updateBrandDto);
  }

  @Delete(dynamic(BrandPaths.BY_BRAND))
  remove(@Param(BrandPaths.BY_BRAND) name: Brand['name']) {
    return this.brandService.remove(name);
  }
}
