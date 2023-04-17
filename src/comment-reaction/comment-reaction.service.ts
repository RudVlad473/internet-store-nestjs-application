import { Injectable } from '@nestjs/common';
import { Comment, CommentRating, Reaction } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PayloadUser } from '../shared/types';
import { CreateCommentReactionDto } from './dto/create-comment-reaction.dto';

@Injectable()
export class CommentReactionService {
  constructor(private prisma: PrismaService) {}

  async create(
    commentId: Comment['id'],
    { reaction }: CreateCommentReactionDto,
    user: PayloadUser,
  ) {
    await this.deleteReaction(commentId, user.id);

    return await this.prisma.commentRating.create({
      data: {
        reaction,
        comment: {
          connect: {
            id: commentId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async getReactionsSum(commentId: Comment['id']) {
    const [likes, dislikes] = await Promise.all([
      this.countLikes(commentId),
      this.countDislikes(commentId),
    ]);

    return likes - dislikes;
  }

  async deleteReaction(
    commentId: CommentRating['comment_id'],
    userId: CommentRating['user_id'],
  ) {
    const reaction = await this.prisma.commentRating.findUnique({
      where: {
        comment_id_user_id: {
          comment_id: commentId,
          user_id: userId,
        },
      },
    });

    if (!reaction) {
      return null;
    }

    return await this.prisma.commentRating.delete({
      where: {
        id: reaction.id,
      },
    });
  }

  async countLikes(commentId: Comment['id']) {
    return await this.prisma.commentRating.count({
      where: {
        comment_id: commentId,
        AND: {
          reaction: {
            equals: Reaction.LIKE,
          },
        },
      },
    });
  }

  async countDislikes(commentId: Comment['id']) {
    return await this.prisma.commentRating.count({
      where: {
        comment_id: commentId,
        AND: {
          reaction: {
            equals: Reaction.DISLIKE,
          },
        },
      },
    });
  }
}
