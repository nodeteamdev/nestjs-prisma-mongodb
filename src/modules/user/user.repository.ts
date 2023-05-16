import { PrismaService } from '@providers/prisma';
import { Injectable } from '@nestjs/common';
import { paginator } from '@nodeteam/nestjs-prisma-pagination';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { Prisma, User } from '@prisma/client';

const paginate: PaginatorTypes.PaginateFunction = paginator({
  page: 1,
  perPage: 10,
});

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(params): Promise<User | null> {
    return this.prisma.user.findFirst(params);
  }

  async create(data): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(
    where: Prisma.UserWhereInput,
    orderBy: Prisma.UserOrderByWithRelationInput,
  ): Promise<PaginatorTypes.PaginatedResult<User>> {
    return paginate(this.prisma.user, {
      where,
      orderBy,
    });
  }
}
