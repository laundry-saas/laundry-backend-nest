import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Order } from '@prisma/client';

export class OrderEntity implements Order {
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  items: any[];
  @ApiProperty()
  customerId: string;
  @ApiProperty()
  vendorId: string;
  @ApiProperty()
  totalAmount: number;
  @ApiProperty()
  note: string;
  @ApiProperty()
  pickUpAddress: string;
  @ApiProperty()
  pickUpDateTime: Date;
  @ApiProperty()
  dropOffDateTime: Date;
  @ApiProperty()
  isExpress: boolean;
  @ApiProperty()
  paymentMode: $Enums.PaymentMode;
  @ApiProperty()
  status: $Enums.OrderStatus;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
