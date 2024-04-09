import { Injectable } from '@nestjs/common';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateOrderDto) {
    let orderItems: { amount: number; itemId: string; quantity: number }[] = [];

    if (payload.items.length) {
      const tasks = payload.items.map(async (item) => {
        const itemResult = await this.prisma.item.findFirst({
          where: { id: item.itemId },
        });

        const amount = itemResult.price * item.quantity;

        return {
          amount,
          quantity: item.quantity,
          itemId: item.itemId,
        };
      });

      orderItems = await Promise.all(tasks);
    }

    const totalAmount = orderItems.reduce(
      (totalAmount, item) => (totalAmount += item.amount),
      0,
    );

    return this.prisma.order.create({
      data: {
        status: payload.status,
        customerId: payload.customerId,
        items: payload.items as unknown as Prisma.JsonArray,
        totalAmount,
        vendorId: payload.vendorId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findFirst({ where: { id } });
  }

  async update(id: string, payload: UpdateOrderDto) {
    let orderItems: { amount: number; itemId: string; quantity: number }[] = [];

    if (payload.items.length) {
      const tasks = payload.items.map(async (item) => {
        const itemResult = await this.prisma.item.findFirst({
          where: { id: item.itemId },
        });

        const amount = itemResult.price * item.quantity;

        return {
          amount,
          quantity: item.quantity,
          itemId: item.itemId,
        };
      });

      orderItems = await Promise.all(tasks);
    }

    const totalAmount = orderItems.reduce(
      (totalAmount, item) => (totalAmount += item.amount),
      0,
    );

    return this.prisma.order.update({
      where: { id },
      data: {
        status: payload.status,
        customerId: payload.customerId,
        items: payload.items as unknown as Prisma.JsonArray,
        totalAmount,
      },
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
