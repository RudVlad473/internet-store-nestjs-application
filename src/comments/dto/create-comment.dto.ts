import { Comment } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsId } from '../../shared/decorator';
import { IsContent } from '../decorator';

export class CreateCommentDto implements Pick<Comment, 'content' | 'item_id'> {
  @IsNotEmpty()
  @IsId()
  item_id: string;

  @IsNotEmpty()
  @IsContent()
  content: string;
}
