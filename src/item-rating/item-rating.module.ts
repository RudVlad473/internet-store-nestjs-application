import { Module } from '@nestjs/common';

import { ItemRatingController } from './item-rating.controller';
import { ItemRatingService } from './item-rating.service';

@Module({
  controllers: [ItemRatingController],
  providers: [ItemRatingService],
})
export class ItemRatingModule {}
