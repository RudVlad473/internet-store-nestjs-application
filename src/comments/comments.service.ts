import { ForbiddenException, Injectable } from '@nestjs/common';
import { Comment, Item, User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PayloadUser } from '../shared/types/payload-user.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create({ content, item_id }: CreateCommentDto, user: PayloadUser) {
    return await this.prisma.comment.create({
      data: {
        content: content,
        item: {
          connect: {
            id: item_id,
          },
        },

        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async createReply(
    parentId: Comment['parentId'],
    { content, item_id }: CreateCommentDto,
    user: PayloadUser,
  ) {
    return await this.prisma.comment.create({
      data: {
        content: content,
        item: {
          connect: {
            id: item_id,
          },
        },

        user: {
          connect: {
            id: user.id,
          },
        },

        parent: {
          connect: {
            id: parentId,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async findAll(itemId: Item['id']) {
    return await this.prisma.comment.findMany({
      where: {
        item_id: itemId,
      },
    });
  }

  async update(
    id: Comment['id'],
    updateCommentDto: UpdateCommentDto,
    user: PayloadUser,
  ) {
    const canUserModify = await this.isUserComment(id, user.id);
    if (!canUserModify) {
      throw new ForbiddenException('You are not allowed to edit this comment');
    }

    return await this.prisma.comment.update({
      where: {
        id,
      },
      data: updateCommentDto,
    });
  }

  async remove(id: Comment['id'], user: PayloadUser) {
    const [canUserModify, hasCommentBeenRepliedTo] = await Promise.all([
      this.isUserComment(id, user.id),
      this.prisma.comment.findFirst({
        where: {
          parentId: id,
        },
      }),
    ]);

    if (!canUserModify) {
      throw new ForbiddenException(
        'You are not allowed to remove this comment',
      );
    }

    if (hasCommentBeenRepliedTo) {
      return await this.prisma.comment.update({
        where: {
          id,
        },
        data: {
          content: '',
        },
      });
    }

    return await this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }

  async isUserComment(commentId: Comment['id'], userId: User['id']) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    return comment.user_id === userId;
  }
}
