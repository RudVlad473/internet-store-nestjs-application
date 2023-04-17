import { IsIn, IsNotEmpty } from 'class-validator';

import { CartAction, TCartAction } from '../../../shared/types/enums';

export class UpdateItemDto implements CartAction {
  @IsNotEmpty()
  @IsIn(Object.keys(TCartAction))
  action: TCartAction;
}
