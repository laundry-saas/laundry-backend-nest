import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Module({
  controllers: [VendorController],
  providers: [VendorService, PrismaService],
  exports: [VendorService],
})
export class VendorModule {}
