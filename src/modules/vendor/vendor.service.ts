import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import { Prisma } from '@prisma/client';
import { VendorEntity } from './entities/vendor.entity';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  create(createVendorDto: CreateVendorDto) {
    const { name, country, contactInfo, userId } = createVendorDto;
    // const json = { businessEmail, businesPhone } as Prisma.JsonObject;
    return this.prisma.vendor.create({
      data: {
        name,
        country,
        contactInfo: contactInfo as unknown as Prisma.JsonValue,
        userId,
      },
    });
  }

  async findByUserIdOrThrow(userId) {
    const foundVendor = await this.prisma.vendor.findFirst({
      where: { userId },
    });
    if (!foundVendor) {
      throw new NotFoundException('Vendor not found');
    }
    return foundVendor;
  }

  async findOrders(userId: string, page: number = 1, pageSize: number = 20) {
    const foundVendor = await this.findByUserIdOrThrow(userId);
    const offset = (page - 1) * pageSize;

    return this.prisma.order.findMany({
      where: {
        vendorId: foundVendor.id,
      },
      take: pageSize,
      skip: offset,
    });
  }

  findAll({ limit, offset }: { limit: number; offset: number }) {
    return this.prisma.vendor.findMany({ take: limit, skip: offset });
  }

  async findOneOrThrow(id: string) {
    const foundVendor = await this.prisma.vendor.findFirst({ where: { id } });
    if (!foundVendor) {
      throw new NotFoundException('Vendor not found');
    }
    return foundVendor;
  }

  update(id: string, updateVendorDto: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: { id },
      data: {
        name: updateVendorDto.name,
        contactInfo: updateVendorDto.contactInfo as unknown as Prisma.JsonValue,
      },
    });
  }

  remove(id: string): Promise<VendorEntity> {
    return this.prisma.vendor.delete({ where: { id } });
  }
}
