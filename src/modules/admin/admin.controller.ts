import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CustomerService } from '../customer/customer.service';
import { OrderService } from '../order/order.service';
import { TransactionService } from '../transaction/transaction.service';
import { CustomerQueryDto } from '../customer/dto/customer-query.dto';
import { OrderQueryDto } from '../order/dto/order-query.dto';
import { UpdateOrderStatus } from '../order/dto/update-order-status.dto';
import { UpdateLaundryStatus } from '../order/dto/update-laundry-status.dto';
import { TransactionQueryDto } from '../transaction/dto/transaction-query.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get('dashboard/stat')
  async getDashboardStat() {
    const customers = await this.customerService.getCount();
    const completedOrders = await this.orderService.getCompletedOrdersCount();
    const totalOrders = await this.orderService.getTotalOrdersCount();
    const totalSales = await this.transactionService.getTotalSalesCount();
    return {
      customers,
      completedOrders,
      totalOrders,
      totalSales,
    };
  }

  @Get('customers')
  getAllCustomers(@Query() query: CustomerQueryDto) {
    console.log('query', query);
    return this.customerService.findAll({
      page: +query.page,
      pageSize: +query.pageSize,
      search: query.search,
      sort: query.sort,
    });
  }

  @Get('orders')
  @ApiOperation({ summary: 'get all created orders' })
  async getAllOrders(@Query() query: OrderQueryDto) {
    const orders = await this.orderService.getAllOrders(query);
    return orders;
  }

  @Patch('orders/:orderId/status')
  @ApiOperation({ summary: 'update order status' })
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderStatus,
  ) {
    await this.orderService.findOrderByIdOrThrow(orderId);
    return this.orderService.updateOrderStatus(orderId, body);
  }

  @Patch('orders/:orderId/laundry-status')
  @ApiOperation({ summary: 'update laundry ] status' })
  async updateLaundryStatus(
    @Param('orderId') orderId: string,
    @Body() body: UpdateLaundryStatus,
  ) {
    await this.orderService.findOrderByIdOrThrow(orderId);
    return this.orderService.updateLaundryStatus(orderId, body);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'get all transactions' })
  async getAllTransactions(
    @Res() res: Response,
    @Query() query: TransactionQueryDto,
  ) {
    const result = await this.transactionService.getAllTransactions({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      sort: query.sort,
    });
    return result;
  }
}
