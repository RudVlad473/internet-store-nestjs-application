import { Comment } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

import { IsId } from '../decorator';

export class ParentIdDto implements Pick<Comment, 'parentId'> {
  @IsNotEmpty()
  @IsId()
  parentId: string;
}
