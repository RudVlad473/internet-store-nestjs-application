import { AuthPaths } from '../../../shared/types/paths';

export const googlePath = `${AuthPaths.AUTH}/${AuthPaths.GOOGLE}/${AuthPaths.GOOGLE_SIGN_UP}`;
export const callbackURL = `http://localhost:${process.env.PORT}/${googlePath}`;

export const scope = ['profile'];
