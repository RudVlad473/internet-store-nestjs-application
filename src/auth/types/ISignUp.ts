export const accessToken = 'access_token';

export type AccessToken = { [accessToken]: string };

export interface ISignUp<T> {
  signup(...args: any[]): Promise<T>;
}
