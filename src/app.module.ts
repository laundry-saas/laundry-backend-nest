import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
// import { CustomerModule } from './modules/customer/customer.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { OrderModule } from './modules/order/order.module';
// import { ReviewModule } from './modules/review/review.module';
// import { NotificationModule } from './modules/notification/notification.module';
import { PriceListModule } from './modules/price-list/price-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    // CustomerModule,
    VendorModule,
    PriceListModule,
    OrderModule,
    // ItemModule,
    // ReviewModule,
    // NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
