import { PayloadUser } from '../../../shared/types';

export type JwtPayloadUser = Omit<PayloadUser, 'id'> & {
  sub: PayloadUser['id'];
};
