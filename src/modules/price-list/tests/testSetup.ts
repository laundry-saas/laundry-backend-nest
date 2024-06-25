import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { PriceListEntity } from '../entities/price-list.entity';

const prisma = new PrismaService();

export const generateSamplePriceListPayload = (
  overrides?: Partial<PriceListEntity>,
) => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    imageUrl: faker.image.url(),
    description: faker.lorem.lines(2),
    price: +faker.commerce.price(),
    vendorId: faker.string.uuid(),
    ...overrides,
  } as PriceListEntity;
};

export const generateSamplePriceList = (
  overrides?: Partial<PriceListEntity>,
) => {
  const payload = generateSamplePriceListPayload(overrides);
  return prisma.priceList.create({ data: payload });
};
