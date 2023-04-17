import { AccessToken } from '../types/ISignUp';

export const authorization = 'Authorization';
export const bearer = 'Bearer';

export function constructJwtBearerHeader({
  access_token,
}: AccessToken): [string, string] {
  return [authorization, `${bearer} ${access_token}`];
}
