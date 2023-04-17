import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Item } from '@prisma/client';

import { User } from '../auth/decorator';
import { FinalGuard } from '../auth/guard';
import { JwtPayloadUser } from '../auth/types/user';
import { ItemPaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { CreateItemRatingDto } from './dto/create-item-rating.dto';
import { ItemRatingService } from './item-rating.service';

@Controller()
export class ItemRatingController {
  constructor(private readonly itemRatingService: ItemRatingService) {}

  @UseGuards(FinalGuard)
  @Post(dynamic(ItemPaths.BY_ID))
  create(
    @Param(ItemPaths.BY_ID) itemId: Item['id'],
    @Body() createItemRatingDto: CreateItemRatingDto,
    @User() user: JwtPayloadUser,
  ) {
    return this.itemRatingService.create(itemId, createItemRatingDto, {
      id: user.sub,
      email: user.email,
      role: user.role,
    });
  }

  @Get(dynamic(ItemPaths.BY_ID))
  getAvgRating(@Param(ItemPaths.BY_ID) itemId: Item['id']) {
    return this.itemRatingService.getAvgRating(itemId);
  }
}
