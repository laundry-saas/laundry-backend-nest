import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { Prisma, OrderItem, OrderStatus } from '@prisma/client';
import { UpdateLaundryStatus } from './dto/update-laundry-status.dto';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { UserEntity } from '../user/entities/user.entity';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderType } from './enum/order-type.enum';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getPriceList() {
    return this.prisma.priceList.findMany();
  }

  async findOrderByIdOrThrow(id: string) {
    const foundOrder = await this.prisma.order.findFirst({ where: { id } });
    if (!foundOrder) {
      throw new NotFoundException(`Order not found`);
    }
    return foundOrder;
  }

  async create(payload: CreateOrderDto) {
    if (!payload.items.length) {
      throw new BadRequestException("Items can't be empty");
    }
    const priceItemObj = payload.items.reduce((acc, item) => {
      if (acc[item.itemId]) {
        acc[item.itemId] += item.quantity;
      }
      acc[item.itemId] = item.quantity;
      return acc;
    }, {});
    const priceItemIds = Object.keys(priceItemObj);
    const priceItems = await this.prisma.priceList.findMany({
      where: { id: { in: priceItemIds } },
    });

    let totalAmount = 0;
    priceItems.forEach((priceItem) => {
      totalAmount += priceItem.price * priceItemObj[priceItem.id];
    });

    // const tasks = payload.items.map(async (item) => {
    //   const itemResult = await this.prisma.priceList.findFirst({
    //     where: { id: item.itemId },
    //   });

    //   const amount = itemResult.price * item.quantity;

    //   return {
    //     amount,
    //     quantity: item.quantity,
    //     itemId: item.itemId,
    //   };
    // });

    // orderItems = await Promise.all(tasks);

    const createdOrder = await this.prisma.order.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        status: payload.status,
        customerId: payload.customerId ?? null,
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

    await this.prisma.orderItem.createMany({
      data: Object.keys(priceItemObj).map((key) => ({
        quantity: priceItemObj[key],
        orderId: createdOrder.id,
        itemId: key,
      })),
    });

    return createdOrder;
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
        totalAmount,
      },
    });
  }

  async getOrderById({ id }: { id: string }) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id },
        include: { orderItems: true },
      });
      if (!order) {
        throw new NotFoundException('order not found');
      }
      const mappedItems = await Promise.all(
        (order.orderItems ?? []).map(async (item: OrderItem) => {
          const priceItem = await this.prisma.priceList.findFirst({
            where: { id: item.itemId },
          });

          return { ...priceItem, quantity: item.quantity };
        }),
      );

      return {
        order: {
          ...order,
          items: mappedItems,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByUser(user: UserEntity) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          customer: {
            userId: user.id,
          },
        },
      });
      return { orders };
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders(query: OrderQueryDto) {
    const { page, pageSize, type, search } = query;
    let filterWhere: Prisma.OrderWhereInput = {
      status: {
        in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      },
    };
    if (type === OrderType.PENDING) {
      filterWhere['status'] = OrderStatus.PENDING;
    }
    if (type === OrderType.NEW) {
      filterWhere['status'] = OrderStatus.NONE;
    }
    // Todo: improve the search filter
    if (search) {
      filterWhere = {
        ...filterWhere,
        customer: {
          // firstName: { startsWith: search, mode: 'insensitive' },
        },
      };
    }

    const orders = await this.prisma.order.findMany({
      take: +pageSize,
      skip: (+page - 1) * +pageSize,
      where: filterWhere,
      include: {
        customer: true,
        orderItems: true,
      },
    });
    const totalCount = await this.prisma.order.count({ where: filterWhere });
    let result = [];
    if (totalCount > 0) {
      const tasks = orders.map(async (order) => {
        const itemObj = {};
        order.orderItems.forEach((item) => {
          itemObj[item.itemId] = item.quantity;
        });

        const items = await this.prisma.priceList.findMany({
          where: {
            id: { in: Object.keys(itemObj).map((id) => id.toString()) },
          },
        });

        return {
          ...order,
          items: items.map((item) => ({ ...item, quantity: itemObj[item.id] })),
        };
      });
      // ...
      result = await Promise.all(tasks);
    }

    return { data: result, pagination: { totalCount, page, pageSize } };
  }

  updateOrderStatus(orderId: string, { status }: UpdateOrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  updateLaundryStatus(orderId: string, { status }: UpdateLaundryStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { laundryStatus: status },
    });
  }

  getTotalOrdersCount() {
    return this.prisma.order.count();
  }

  getCompletedOrdersCount() {
    return this.prisma.order.count({
      where: { status: OrderStatus.DELIVERED },
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.delete({ where: { id } });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return {
      message: 'Order was deleted!',
    };
  }
}
