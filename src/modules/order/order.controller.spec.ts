import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { INestApplication } from '@nestjs/common';
import createTestApp from 'src/libs/commons/tests/setup';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import * as builtHttpRequest from 'supertest';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import {
  generateSampleUser,
  generateSampleUserPayload,
} from '../auth/tests/testSetup';
import { faker } from '@faker-js/faker';
import { generateSampleVendor } from '../vendor/tests/testSetup';
import {
  generateSampleCustomer,
  generateSampleCustomerPayload,
} from '../customer/tests/testSetup';
import { generateSamplePriceList } from '../price-list/tests/testSetup';
import { generateSampleOrderPayload } from './tests/testSetup';
import { PriceList } from '@prisma/client';

describe('OrderController', () => {
  let app: INestApplication;
  const userId: string = faker.string.uuid();
  const customerId: string = faker.string.uuid();
  const customerUserId: string = faker.string.uuid();
  const vendorId: string = faker.string.uuid();
  let priceList: PriceList;
  const PRICE = 500;
  const TOTAL_PRICE = 1000;
  beforeEach(async () => {
    const user = generateSampleUserPayload({ id: userId });
    const customerUser = generateSampleUserPayload({
      id: customerUserId,
      email: user.email,
      phone: user.phone,
    });

    app = await createTestApp({
      imports: [],
      controllers: [OrderController],
      providers: [OrderService, PrismaService],
    });

    await generateSampleUser(user);
    await generateSampleUser(customerUser);
    await generateSampleVendor({ id: vendorId, userId });
    await generateSampleCustomer({
      id: customerId,
      userId: customerUserId,
      vendorId,
    });
    priceList = await generateSamplePriceList({ vendorId, price: PRICE });
  });

  describe('CreateOrder', () => {
    const request = async (payload: CreateOrderDto) =>
      await builtHttpRequest(app.getHttpServer()).post('/order').send(payload);

    it('should create a new order', async () => {
      const payload = generateSampleOrderPayload({
        vendorId,
        items: [{ itemId: priceList.id, quantity: 2 }] as CreateOrderItemDto[],
      });

      const { status, body } = await request({
        ...payload,
        customerId,
        vendorId,
        pickUpDateTime: payload.pickUpDateTime.toISOString(),
        dropOffDateTime: payload.dropOffDateTime.toISOString(),
      });
      expect(status).toEqual(201);
      expect(body.totalAmount).toEqual(TOTAL_PRICE);
    });
  });
});
