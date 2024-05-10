import { PrismaService } from '@providers/prisma';
import { Injectable } from '@nestjs/common';
import { paginator } from '@nodeteam/nestjs-prisma-pagination';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { Prisma, SocialAccount } from '@prisma/client';

@Injectable()
export class SocialRepository {
  private readonly paginate: PaginatorTypes.PaginateFunction;

  constructor(private prisma: PrismaService) {
    /**
     * @desc Create a paginate function
     * @param model
     * @param options
     * @returns Promise<PaginatorTypes.PaginatedResult<T>>
     */
    this.paginate = paginator({
      page: 1,
      perPage: 10,
    });
  }

  findById(id: string): Promise<SocialAccount> {
    return this.prisma.socialAccount.findUnique({
      where: { id },
    });
  }

  /**
   * @desc Find a social account
   * @param params Prisma.SocialAccountFindFirstArgs
   * @returns Promise<SocialAccount | null>
   *       If the social account is not found, return null
   */
  async findOne(
    params: Prisma.SocialAccountFindFirstArgs,
  ): Promise<SocialAccount | null> {
    return this.prisma.socialAccount.findFirst(params);
  }

  /**
   * @desc Create a new social account
   * @param data Prisma.SocialAccountCreateInput
   * @returns Promise<SocialAccount>
   */
  async create(data: Prisma.SocialAccountCreateInput): Promise<SocialAccount> {
    return this.prisma.socialAccount.create({
      data,
    });
  }

  /**
   * @desc find all social accounts
   * @param where Prisma.SocialAccountWhereInput
   * @param orderBy Prisma.SocialAccountOrderByWithRelationInput
   * @returns Promise<PaginatorTypes.PaginatedResult<SocialAccount>>
   */
  async findAll(
    where: Prisma.SocialAccountWhereInput,
    orderBy: Prisma.SocialAccountOrderByWithRelationInput,
  ): Promise<PaginatorTypes.PaginatedResult<SocialAccount>> {
    return this.paginate(this.prisma.socialAccount, {
      where,
      orderBy,
    });
  }

  /**
   * @desc Get social account by provider id
   * @param providerId Prisma.SocialAccountWhereUniqueInput
   * @returns Promise<SocialAccount>
   */
  async getSocialAccountByProviderId(
    providerId: string,
  ): Promise<SocialAccount> {
    return this.prisma.socialAccount.findFirst({
      where: {
        providerId,
      },
    });
  }
}
