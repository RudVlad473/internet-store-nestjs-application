import { AuthGuard } from '@nestjs/passport';

export const jwt = 'jwt';

export class JwtGuard extends AuthGuard(jwt) {
  constructor() {
    super();
  }
}
