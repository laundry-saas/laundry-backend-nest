import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateItemDto) {
    return this.prisma.item.create({
      data: payload,
    });
  }

  findAll(vendorId: string) {
    return this.prisma.item.findMany({ where: { vendorId } });
  }

  findOne(id: string) {
    return this.prisma.item.findFirst({ where: { id } });
  }

  update(id: string, updateItemDto: UpdateItemDto) {
    return this.prisma.item.update({ where: { id }, data: updateItemDto });
  }

  remove(id: string) {
    return this.prisma.item.delete({ where: { id } });
  }
}
