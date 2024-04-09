import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        title: '',
        message: '',
        userId: '',
      },
    });
  }

  findAll(userId: string, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;
    return this.prisma.notification.findMany({
      where: { userId },
      take: pageSize,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findFirst({where: {id}});
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: {id},
      data: updateNotificationDto,
    })
  }

  remove(id: string) {
    return this.prisma.notification.delete({where: {id}});
  }
}
