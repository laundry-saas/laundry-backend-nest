import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        comment: payload.comment,
        rating: payload.rating,
        orderId: payload.orderId,
        customerId: payload.customerId,
      },
    });
  }

  findAll(orderId: string, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize;
    return this.prisma.review.findMany({
      where: { orderId },
      take: pageSize,
      skip: offset,
      include: {
        order: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.review.findFirst({
      where: { id },
    });
  }

  update(id: string, payload: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: {
        comment: payload.comment,
        rating: payload.rating,
        orderId: payload.orderId,
        customerId: payload.customerId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
