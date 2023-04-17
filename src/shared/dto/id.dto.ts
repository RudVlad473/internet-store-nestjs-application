import { IsNotEmpty } from 'class-validator';

import { IsId } from '../decorator';

export class BaseIdDto {
  @IsNotEmpty()
  @IsId()
  id: string;
}
