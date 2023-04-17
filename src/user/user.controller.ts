import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { User } from '../auth/decorator';
import { FinalGuard } from '../auth/guard';
import { PayloadUser } from '../shared/types';
import { UserPaths } from '../shared/types/paths';
import { dynamic } from '../shared/utils';
import { EditUserDto } from './dto/editUser.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(FinalGuard)
  @Get()
  getSelf(@User() user) {
    return this.userService.getSelf(user);
  }

  @UseGuards(FinalGuard)
  @Patch(UserPaths.SELF)
  editSelf(@User('email') user: PayloadUser, @Body() editUserDto: EditUserDto) {
    return this.userService.editSelf({
      email: user.email,
      userName: editUserDto.userName,
    });
  }

  @Get(dynamic(UserPaths.USERNAME))
  getUserByUsername(@Param(UserPaths.USERNAME) userName: string) {
    return this.userService.getUserByUsername(userName);
  }
}
