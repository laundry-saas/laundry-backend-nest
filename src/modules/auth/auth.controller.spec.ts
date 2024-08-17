import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication } from '@nestjs/common';
import createTestApp from 'src/libs/commons/tests/setup';
import * as builtHttpRequest from 'supertest';
import {
  CreateAuthVendorDto,
  CreateCustomerAuthDto,
} from './dto/create-auth.dto';
import { faker } from '@faker-js/faker';
import {
  generateSampleUser,
  generateSampleUserPayload,
} from './tests/testSetup';
import { generateSampleVendor } from '../vendor/tests/testSetup';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { JwtService } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { VendorModule } from '../vendor/vendor.module';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../user/entities/user.entity';
import * as argon from 'argon2';

const prisma = new PrismaService({
  log: ['query', 'info', 'warn', 'error'],
});

describe('AuthController', () => {
  let app: INestApplication = null;
  const userId: string = faker.string.uuid();
  const vendorId: string = faker.string.uuid();

  beforeEach(async () => {
    app = await createTestApp({
      imports: [UserModule, CustomerModule, VendorModule],
      controllers: [AuthController],
      providers: [AuthService, JwtService, PrismaService],
    });
  });

  describe('POST /auth/register/vendor', () => {
    beforeEach(async () => {
      await generateSampleUser({ id: userId });
    });
    afterEach(async () => {
      await prisma.vendor.deleteMany();
      await prisma.user.delete({ where: { id: userId } });
    });
    const request = async (payload: CreateAuthVendorDto) =>
      await builtHttpRequest(app.getHttpServer())
        .post(`/auth/register/vendor`)
        .send(payload);

    it('should register vendor', async () => {
      const payload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123',
        phone: faker.phone.number(),
        businesEmail: faker.internet.exampleEmail(),
        businessPhone: faker.phone.number(),
        country: faker.location.country(),
        role: 'VENDOR',
      } as CreateAuthVendorDto;
      const { status, body } = await request(payload);
      expect(status).toEqual(201);
      expect(body).toHaveProperty('access_token');
    });
  });

  describe.only('POST /auth/register/customer', () => {
    beforeEach(async () => {
      await generateSampleUser({ id: userId });
      await generateSampleVendor({ id: vendorId, userId });
    });
    afterEach(async () => {
      // await prisma.order.deleteMany();
      // await prisma.customer.deleteMany();
      // await prisma.vendor.delete({
      //   where: { id: vendorId },
      // });
      // await prisma.user.delete({ where: { id: userId } });
    });
    const request = async (payload: CreateCustomerAuthDto) =>
      await builtHttpRequest(app.getHttpServer())
        .post(`/auth/register/customer`)
        .send(payload);

    it('should register customer', async () => {
      const payload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123',
        phone: faker.phone.number(),
        role: 'CUSTOMER',
        vendorId,
      } as CreateCustomerAuthDto;
      const { status, body } = await request(payload);
      expect(status).toEqual(201);
      expect(body).toHaveProperty('access_token');
    });
    it('can register a customer with no email', async () => {
      const payload = {
        name: faker.person.fullName(),
        email: null,
        password: 'password123',
        phone: faker.phone.number(),
        role: 'CUSTOMER',
        vendorId,
      } as CreateCustomerAuthDto;
      const { status, body } = await request(payload);
      expect(status).toEqual(201);
      expect(body).toHaveProperty('access_token');
    });
  });

  describe('POST /auth/login', () => {
    let user: UserEntity;
    beforeEach(async () => {
      const hashedPassword = await argon.hash('password123');
      user = generateSampleUserPayload({
        id: userId,
        password: hashedPassword,
      });

      await generateSampleUser(user);
    });

    afterEach(async () => {
      await prisma.user.delete({ where: { id: userId } });
    });

    const request = async (payload: LoginDto) =>
      await builtHttpRequest(app.getHttpServer())
        .post(`/auth/login`)
        .send(payload);

    it('should throw error when login is not valid', async () => {
      const payload = {
        email: faker.internet.email(),
        password: 'password123',
      } as LoginDto;
      const { status } = await request(payload);
      expect(status).toEqual(403);
    });

    it('should login successfully', async () => {
      const payload = {
        email: user.email,
        password: 'password123',
      } as LoginDto;
      const { status, body } = await request(payload);
      expect(status).toEqual(201);
      expect(body).toHaveProperty('access_token');
    });
  });
});
