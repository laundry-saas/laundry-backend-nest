import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { CustomerEntity } from '../entities/customer.entity';

const prisma = new PrismaService();

export const generateSampleCustomerPayload = (
  overrides?: Partial<CustomerEntity>,
) => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    vendorId: faker.string.uuid(),
    ...overrides,
  } as CustomerEntity;
};

export const generateSampleCustomer = (overrides?: Partial<CustomerEntity>) => {
  const payload = generateSampleCustomerPayload(overrides);
  return prisma.customer.create({ data: payload });
};
