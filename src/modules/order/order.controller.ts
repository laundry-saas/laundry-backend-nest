import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    // await this.orderService.validateCustomerPendingOrderWithVendor(
    //   createOrderDto.vendorId,
    //   createOrderDto.customerId,
    // );
    return this.orderService.create(createOrderDto);
  }
}
