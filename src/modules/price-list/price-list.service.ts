import { Injectable } from '@nestjs/common';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class PriceListService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreatePriceListDto) {
    return this.prisma.priceList.create({
      data: payload,
    });
  }

  findAllByVendor(vendorId: string) {
    return this.prisma.priceList.findMany({ where: { vendorId } });
  }

  findOne(id: string) {
    return this.prisma.priceList.findFirst({ where: { id } });
  }

  update(id: string, updateItemDto: UpdatePriceListDto) {
    return this.prisma.priceList.update({ where: { id }, data: updateItemDto });
  }

  remove(id: string) {
    return this.prisma.priceList.delete({ where: { id } });
  }
}
