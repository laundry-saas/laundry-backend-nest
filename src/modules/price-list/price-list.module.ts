import { Module } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceListController } from './price-list.controller';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Module({
  controllers: [PriceListController],
  providers: [PriceListService, PrismaService],
})
export class PriceListModule {}
