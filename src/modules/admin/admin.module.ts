import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { CustomerModule } from '../customer/customer.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TransactionModule, CustomerModule, OrderModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
