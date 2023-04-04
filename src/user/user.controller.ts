import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserPaths } from '../enums';
import { GetUserDto } from './dto/getUser.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PayloadUser } from 'src/auth/strategy';

@Controller(UserPaths.USER)
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(UserPaths.SELF)
  getSelf(@Req() req: Request) {
    const user = req.user as PayloadUser;

    return this.userService.getSelf(user);
  }

  @Get(`:${UserPaths.USERNAME}`)
  getUserByUsername(@Param() { userName }: GetUserDto) {
    return this.userService.getUserByUsername(userName);
  }
}
