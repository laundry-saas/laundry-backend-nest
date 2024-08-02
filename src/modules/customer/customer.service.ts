import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { SortOrder } from 'src/libs/commons/enums/sort-order';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        vendorId: payload.vendorId,
        userId: payload.userId,
      },
    });
  }

  getCount() {
    return this.prisma.customer.count();
  }

  async findCustomerByUserIdOrThrow(userId: string) {
    const foundCustomer = await this.prisma.customer.findFirst({
      where: { userId },
    });
    if (!foundCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return foundCustomer;
  }

  async findOrders(
    customerId: string,
    page: number = 1,
    pageSize: number = 20,
  ) {
    const offset = (page - 1) * pageSize;

    return this.prisma.order.findMany({
      where: {
        customerId,
      },
      take: pageSize,
      skip: offset,
    });
  }

  async findAll({
    page = 1,
    pageSize = 10,
    sort = SortOrder.DESC,
    search,
  }: {
    page: number;
    pageSize: number;
    sort?: SortOrder;
    search?: string;
  }) {
    let filterWhere: Prisma.CustomerWhereInput = {};
    if (search) {
      //TODO: @me FIX THE SEEARCH
      filterWhere = {
        // firstName: { startsWith: search, mode: 'insensitive' },
        // lastName: { startsWith: search, mode: 'insensitive' },
        user: {
          email: { startsWith: search, mode: 'insensitive' },
          // phoneNumber: { startsWith: search, mode: 'insensitive' },
        },
      };
    }

    const offset = (page - 1) * pageSize;
    const data = await this.prisma.customer.findMany({
      where: filterWhere,
      skip: offset,
      take: pageSize,
      include: { user: true },
      orderBy: { createdAt: sort },
    });

    const totalCount = await this.prisma.customer.count({
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

  findOne(id: string) {
    return this.prisma.customer.findFirst({ where: { id } });
  }

  update(id: string, payload: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: payload,
    });
  }

  remove(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }
}
