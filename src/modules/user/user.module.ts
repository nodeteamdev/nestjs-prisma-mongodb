import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from '@modules/user/user.repository';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/user/user.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
