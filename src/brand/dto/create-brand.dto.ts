import { Brand } from '@prisma/client';
import { IsNotEmpty, IsUrl } from 'class-validator';

import { IsName } from '../decorator';

export class CreateBrandDto implements Pick<Brand, 'websiteUrl' | 'name'> {
  @IsNotEmpty()
  @IsName()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  websiteUrl: string;
}
