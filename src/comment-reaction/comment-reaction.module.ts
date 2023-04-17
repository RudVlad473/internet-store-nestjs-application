import { Module } from '@nestjs/common';

import { CommentReactionController } from './comment-reaction.controller';
import { CommentReactionService } from './comment-reaction.service';

@Module({
  controllers: [CommentReactionController],
  providers: [CommentReactionService],
})
export class CommentReactionModule {}
