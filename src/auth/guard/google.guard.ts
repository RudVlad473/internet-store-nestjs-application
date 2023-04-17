import { AuthGuard } from '@nestjs/passport';

export const google = 'google';

export class GoogleGuard extends AuthGuard(google) {
  constructor() {
    super();
  }
}
