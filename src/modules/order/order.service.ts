import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async validateCustomerPendingOrderWithVendor(
    vendorId: string,
    customerId: string,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        vendorId,
        customerId,
        status: OrderStatus.PENDING,
      },
    });

    if (order) {
      throw new Error('You have a pending order with this vendor');
    }
  }

  async create(payload: CreateOrderDto) {
    let orderItems: { amount: number; itemId: string; quantity: number }[] = [];

    if (payload.items.length) {
      const tasks = payload.items.map(async (item) => {
        const itemResult = await this.prisma.priceList.findFirst({
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
        isExpress: payload.isExpress,
        pickUpAddress: payload.pickUpAddress,
        pickUpDateTime: payload.pickUpDateTime,
        dropOffDateTime: payload.dropOffDateTime,
        note: payload.note,
        paymentMode: payload.paymentMode,
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
        const itemResult = await this.prisma.priceList.findFirst({
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
        items: payload.items as unknown as Prisma.JsonArray,
        totalAmount,
      },
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
