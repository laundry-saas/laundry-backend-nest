import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService){}

  create(payload: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        vendorId: payload.vendorId,
        userId: payload.userId,
      }
    })
  }

  async findByUserIdOrThrow(userId: string) {
    const foundCustomer = await this.prisma.customer.findFirst({where: {userId}})
    if(!foundCustomer) {
      throw new NotFoundException('Customer not found')
    }
    return foundCustomer;
  }

  async findOrders(userId: string, page: number = 1, pageSize: number = 20) {
    const foundCustomer = await this.findByUserIdOrThrow(userId)
    const offset = (page - 1) * pageSize;
    
    return this.prisma.order.findMany({
      where: {
        customerId: foundCustomer.id,
      },
      take: pageSize,
      skip: offset,
    })
  }

  findAll(page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;
    return this.prisma.customer.findMany({
      take: pageSize,
      skip: offset,
    })
  }

  findOne(id: string) {
    return this.prisma.customer.findFirst({where: {id}})
  }

  update(id: string, payload: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: {id},
      data: payload,
    })
  }

  remove(id: string) {
    return this.prisma.customer.delete({where: {id}})
  }
}
