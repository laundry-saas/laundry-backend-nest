import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CurrentUser } from 'src/libs/commons/decorators/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getOrders(@CurrentUser() user: UserEntity) {
    const customer = await this.customerService.findCustomerByUserIdOrThrow(
      user.id,
    );
    return this.customerService.findOrders(customer.id);
  }
}
