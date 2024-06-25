import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsString()
  itemId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @Type(() => CreateOrderItemDto)
  @ValidateNested({ each: true })
  @IsArray()
  items: CreateOrderItemDto[];

  @ApiProperty()
  @IsBoolean()
  isExpress: boolean;

  @ApiProperty()
  @IsDateString()
  pickUpDateTime: string;

  @ApiProperty()
  @IsDateString()
  dropOffDateTime: string;

  @ApiProperty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty()
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsString()
  pickUpAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;
}
