import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Comment } from '@prisma/client';

import { User } from '../auth/decorator';
import { FinalGuard } from '../auth/guard';
import { JwtPayloadUser } from '../auth/types/user';
import { CommentPaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { CommentReactionService } from './comment-reaction.service';
import { CreateCommentReactionDto } from './dto/create-comment-reaction.dto';

@Controller()
export class CommentReactionController {
  constructor(
    private readonly commentReactionService: CommentReactionService,
  ) {}

  @UseGuards(FinalGuard)
  @Post(dynamic(CommentPaths.BY_ID))
  create(
    @Param(CommentPaths.BY_ID) commentId: Comment['id'],
    @Body() dto: CreateCommentReactionDto,
    @User() user: JwtPayloadUser,
  ) {
    return this.commentReactionService.create(commentId, dto, {
      id: user.sub,
      email: user.email,
      role: user.role,
    });
  }

  @Get(dynamic(CommentPaths.BY_ID))
  getReactionsSum(@Param(CommentPaths.BY_ID) commentId: Comment['id']) {
    return this.commentReactionService.getReactionsSum(commentId);
  }
}
