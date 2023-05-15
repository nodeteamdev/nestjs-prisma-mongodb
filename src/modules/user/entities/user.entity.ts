import { User } from '@prisma/client';

export default class UserEntity implements User {
  readonly id!: string;

  readonly phone!: string | null;

  readonly email!: string;

  readonly firstName!: string | null;

  readonly lastName!: string | null;

  readonly password!: string | null;

  readonly createdAt!: Date;

  readonly updatedAt!: Date;

  readonly isVerified!: boolean;
}
