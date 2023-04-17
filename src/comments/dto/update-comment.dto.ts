import { Comment } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsContent } from '../decorator';

export class UpdateCommentDto implements Pick<Comment, 'content'> {
  @IsNotEmpty()
  @IsContent()
  content: string;
}
