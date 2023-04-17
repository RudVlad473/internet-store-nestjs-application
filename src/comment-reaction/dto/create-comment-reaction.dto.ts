import { CommentRating, Reaction } from '@prisma/client';
import { IsIn, IsNotEmpty } from 'class-validator';

import { commentReactions } from '../../shared/types/enums';

export class CreateCommentReactionDto
  implements Pick<CommentRating, 'reaction'>
{
  @IsNotEmpty()
  @IsIn(commentReactions)
  reaction: Reaction;
}
