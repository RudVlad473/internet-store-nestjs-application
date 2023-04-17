import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Item } from '@prisma/client';

import { ItemPaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './item.service';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(dynamic(ItemPaths.BY_ID))
  findById(@Param(ItemPaths.BY_ID) id: Item['id']) {
    return this.itemService.findById(id);
  }

  @Patch(dynamic(ItemPaths.BY_ID))
  update(
    @Param(ItemPaths.BY_ID) id: Item['id'],
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(dynamic(ItemPaths.BY_ID))
  remove(@Param(ItemPaths.BY_ID) id: Item['id']) {
    return this.itemService.remove(id);
  }
}
