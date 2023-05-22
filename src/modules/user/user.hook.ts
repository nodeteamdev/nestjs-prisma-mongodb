import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { UserBeforeFilterHook } from '@modules/casl';
import { User } from '@prisma/client';

@Injectable()
export class UserHook implements UserBeforeFilterHook<User> {
  constructor(readonly userService: UserService) {}

  async run(request) {
    return this.userService.findById(request.user.id);
  }
}
