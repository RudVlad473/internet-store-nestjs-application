import { AuthGuard } from '@nestjs/passport';

import { jwt } from './jwt.guard';

//const google = 'google';

const guards = [jwt];

export class FinalGuard extends AuthGuard(guards) {
  constructor() {
    super();
  }
}
