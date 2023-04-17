import { IsNotEmpty } from 'class-validator';

import { IsId } from '../../shared/decorator';
import { TTypeMock } from '../../shared/test/initMocks/typeMocks';
import { IsName } from '../decorator';

export class CreateTypeDto implements TTypeMock {
  @IsNotEmpty()
  @IsName()
  name: string;

  @IsNotEmpty()
  @IsId()
  category_id: string;
}
