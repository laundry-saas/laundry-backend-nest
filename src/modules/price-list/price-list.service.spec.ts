// import { PriceListService } from './price-list.service';
// import { PrismaService } from 'src/libs/prisma/prisma.client';
// import { generateSamplePriceListPayload } from './tests/testSetup';
// import { INestApplication } from '@nestjs/common';
// import createTestApp from 'src/libs/commons/tests/setup';
// import { faker } from '@faker-js/faker';
// import { generateSampleVendorPayload } from '../vendor/tests/testSetup';
// const prisma = new PrismaService();
// describe('PriceListService', () => {
//   let app: INestApplication;
//   let service: PriceListService;

//   beforeEach(async () => {
//     app = await createTestApp({
//       imports: [],
//       providers: [PrismaService, PriceListService],
//     });

//     service = app.get<PriceListService>(PriceListService);
//   });

//   // describe('Create Price List', () => {
//   //   it('should create a new price list', async () => {
//   //     const vendorId = faker.string.uuid();
//   //     const payload = generateSamplePriceListPayload({ vendorId });
//   //     jest.spyOn(prisma.priceList, 'create').mockResolvedValue(payload);
//   //     const result = await service.create(payload);
//   //     expect(result).toMatchObject(payload);
//   //   });
//   // });
// });
