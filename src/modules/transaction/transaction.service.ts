import { Injectable } from '@nestjs/common';
import { TransactionStatus, Prisma } from '@prisma/client';
import { SortOrder } from 'src/libs/commons/enums/sort-order';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  getTotalSalesCount() {
    return this.prismaService.transaction.count({
      where: { status: TransactionStatus.SUCCESS },
    });
  }

  async getAllTransactions({
    page,
    pageSize,
    sort,
    search,
  }: {
    page: number;
    pageSize: number;
    sort?: SortOrder;
    search?: string;
  }) {
    let filterWhere: Prisma.TransactionWhereInput = {};
    if (search) {
      filterWhere = {
        reference: {
          startsWith: search,
          mode: 'insensitive',
        },
      };
    }

    const offset = (page - 1) * pageSize;
    const data = await this.prismaService.transaction.findMany({
      where: filterWhere,
      skip: offset,
      take: pageSize,
      include: { customer: true },
      orderBy: { createdAt: sort },
    });

    const totalCount = await this.prismaService.transaction.count({
      where: filterWhere,
    });

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalCount,
      },
    };
  }
}
