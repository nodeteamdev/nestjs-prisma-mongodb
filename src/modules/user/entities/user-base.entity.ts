import { Exclude, Expose } from 'class-transformer';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import UserEntity from '@modules/user/entities/user.entity';

@Exclude()
export default class UserBaseEntity extends PartialType(UserEntity) {
  @ApiProperty({ type: String })
  @Expose()
  declare readonly id: string;

  @ApiProperty({ type: String, maxLength: 18 })
  @Expose()
  declare readonly phone: string | null;

  @ApiProperty({ type: String, maxLength: 18, nullable: true })
  @Expose()
  declare readonly firstName: string | null;

  @ApiProperty({ type: String, maxLength: 18, nullable: true })
  @Expose()
  declare readonly lastName: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  declare readonly email: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  declare readonly avatar: string | null;

  @ApiProperty({ type: Boolean })
  @Expose()
  declare readonly isVerified: boolean;
}
