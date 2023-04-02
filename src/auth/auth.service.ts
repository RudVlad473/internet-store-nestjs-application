import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signin() {
    return "You've been successfully signed in!";
  }

  signup() {
    return "You've been successfully signed up!";
  }
}
