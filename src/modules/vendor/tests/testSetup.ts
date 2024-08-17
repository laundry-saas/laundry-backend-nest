import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { VendorEntity } from '../entities/vendor.entity';

const prisma = new PrismaService();

export const generateSampleVendorPayload = (
  overrides?: Partial<VendorEntity>,
) => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.company.name(),
    country: faker.location.country(),
    ...overrides,
  } as VendorEntity;
};

export const generateSampleVendor = async (
  overrides?: Partial<VendorEntity>,
) => {
  const payload = generateSampleVendorPayload(overrides);
  return prisma.vendor.create({ data: payload });
};
