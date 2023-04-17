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
import { Comment } from '@prisma/client';

import { User } from '../auth/decorator';
import { FinalGuard } from '../auth/guard';
import { JwtPayloadUser } from '../auth/types/user';
import { CommentPaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(FinalGuard)
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: JwtPayloadUser,
  ) {
    return this.commentsService.create(createCommentDto, {
      id: user.sub,
      role: user.role,
      email: user.email,
    });
  }

  @UseGuards(FinalGuard)
  @Post(dynamic(CommentPaths.BY_PARENT_ID))
  createReply(
    @Param(CommentPaths.BY_PARENT_ID) parentId: Comment['parentId'],
    @Body() createCommentDto: CreateCommentDto,
    @User() user: JwtPayloadUser,
  ) {
    return this.commentsService.createReply(parentId, createCommentDto, {
      id: user.sub,
      role: user.role,
      email: user.email,
    });
  }

  @Get()
  findAll(@Body() item: { itemId: string }) {
    return this.commentsService.findAll(item.itemId);
  }

  @UseGuards(FinalGuard)
  @Patch(dynamic(CommentPaths.BY_ID))
  update(
    @Param(CommentPaths.BY_ID) id: Comment['id'],
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: JwtPayloadUser,
  ) {
    return this.commentsService.update(id, updateCommentDto, {
      id: user.sub,
      role: user.role,
      email: user.email,
    });
  }

  @UseGuards(FinalGuard)
  @Delete(dynamic(CommentPaths.BY_ID))
  remove(
    @Param(CommentPaths.BY_ID) id: Comment['id'],
    @User() user: JwtPayloadUser,
  ) {
    return this.commentsService.remove(id, {
      id: user.sub,
      role: user.role,
      email: user.email,
    });
  }
}
