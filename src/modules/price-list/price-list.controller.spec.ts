import { PriceListController } from './price-list.controller';
import { PriceListService } from './price-list.service';
import { INestApplication } from '@nestjs/common';
import createTestApp from 'src/libs/commons/tests/setup';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { UserEntity } from '../user/entities/user.entity';
import {
  generateSampleUser,
  generateSampleUserPayload,
} from '../auth/tests/testSetup';
import { faker } from '@faker-js/faker';
import { UserRole } from '@prisma/client';
import * as builtHttpRequest from 'supertest';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { generateSampleVendor } from '../vendor/tests/testSetup';
import { generateSamplePriceList } from './tests/testSetup';

const prisma = new PrismaService();

describe('PriceListController', () => {
  let app: INestApplication = null;
  const userId: string = faker.string.uuid();
  let user: UserEntity;
  const vendorId: string = faker.string.uuid();

  beforeEach(async () => {
    user = generateSampleUserPayload({
      id: userId,
      role: UserRole.VENDOR,
    });

    app = await createTestApp({
      imports: [],
      controllers: [PriceListController],
      providers: [PriceListService, PrismaService],
      testUser: user,
    });
    await generateSampleUser(user);
    await generateSampleVendor({
      id: vendorId,
      userId,
    });
  });

  afterEach(async () => {
    await prisma.priceList.deleteMany();
    await prisma.vendor.delete({ where: { id: vendorId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  describe('POST /price-list', () => {
    const request = async (payload: CreatePriceListDto) =>
      await builtHttpRequest(app.getHttpServer())
        .post('/price-list')
        .send(payload);
    it('should create a new price list', async () => {
      const payload = {
        name: faker.commerce.productName(),
        imageUrl: faker.image.url(),
        description: faker.lorem.lines(2),
        price: +faker.commerce.price(),
        vendorId,
      } as CreatePriceListDto;

      const { status, body } = await request(payload);
      expect(status).toEqual(201);
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('price');
    });
  });

  describe('GET /price-list/:vendorId', () => {
    beforeEach(async () => {
      await generateSamplePriceList({ vendorId });
      await generateSamplePriceList({ vendorId });
      await generateSamplePriceList({ vendorId });
    });

    const request = async () =>
      await builtHttpRequest(app.getHttpServer()).get(
        `/price-list/${vendorId}`,
      );

    it('should return a list of price list', async () => {
      const { status, body } = await request();
      expect(status).toEqual(200);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(3);
    });
  });
  describe('PUT', () => {
    let priceListId: string;
    beforeEach(async () => {
      const priceList = await generateSamplePriceList({ vendorId });
      priceListId = priceList.id;
    });

    const request = async (payload: CreatePriceListDto) =>
      await builtHttpRequest(app.getHttpServer())
        .put(`/price-list/${priceListId}`)
        .send(payload);

    it('should update a price list', async () => {
      const payload = {
        name: faker.commerce.productName(),
        imageUrl: faker.image.url(),
        description: faker.lorem.lines(2),
        price: +faker.commerce.price(),
        vendorId,
      } as CreatePriceListDto;

      const { status, body } = await request(payload);
      expect(status).toEqual(200);
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('price');
    });
  });
  describe('DELETE /price-list/:id', () => {
    let priceListId: string;
    beforeEach(async () => {
      const priceList = await generateSamplePriceList({ vendorId });
      priceListId = priceList.id;
    });

    const request = async () =>
      await builtHttpRequest(app.getHttpServer()).delete(
        `/price-list/${priceListId}`,
      );

    it('should delete a price list', async () => {
      const { status } = await request();
      expect(status).toEqual(200);
    });
  });
});
