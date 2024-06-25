import { faker } from '@faker-js/faker';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma/prisma.client';

const prisma = new PrismaService();

export const generateSampleUserPayload = (overrides?: Partial<User>) => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.enumValue(UserRole),
    phone: faker.phone.number(),
    ...overrides,
  } as User;
};

export const generateSampleUser = (overrides?: Partial<User>) => {
  const payload = generateSampleUserPayload(overrides);
  return prisma.user.create({ data: payload });
};
