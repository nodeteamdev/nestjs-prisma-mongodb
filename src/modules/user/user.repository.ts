import { PrismaService } from '@providers/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    return this.prisma.user.create({
      data,
    });
  }
}
