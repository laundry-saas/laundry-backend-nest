import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { OrderEntity } from '../entities/order.entity';
import { OrderStatus } from '@prisma/client';

const prisma = new PrismaService();

export const generateSampleOrderPayload = (
  overrides?: Partial<OrderEntity>,
) => {
  return {
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    vendorId: faker.string.uuid(),
    dropOffDateTime: faker.date.anytime(),
    pickUpDateTime: faker.date.anytime(),
    pickUpAddress: faker.location.streetAddress(),
    isExpress: faker.datatype.boolean(),
    note: faker.lorem.lines(3),
    status: faker.helpers.enumValue(OrderStatus),
    totalAmount: faker.finance.amount(),
    ...overrides,
  } as OrderEntity;
};

export const generateSampleOrder = (overrides?: Partial<OrderEntity>) => {
  const payload = generateSampleOrderPayload(overrides);
  return prisma.order.create({ data: payload });
};
