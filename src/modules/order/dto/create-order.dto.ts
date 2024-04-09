import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, isUUID, IsUUID, ValidateNested } from "class-validator";

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
    @ValidateNested({each: true})
    @IsArray()
    items: CreateOrderItemDto[];
}
