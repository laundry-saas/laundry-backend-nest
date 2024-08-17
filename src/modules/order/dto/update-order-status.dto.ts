import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatus {
  @ApiProperty({ example: Object.keys(OrderStatus).join('|') })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
