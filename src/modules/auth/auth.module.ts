import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../libs/prisma/prisma.client';
import { JwtModule } from '@nestjs/jwt';
import { Config } from 'src/libs/configs/constants.config';
import { JwtStrategy } from './strategies';
import { UserModule } from 'src/modules/user/user.module';
import { CustomerModule } from '../customer/customer.module';
import { VendorModule } from '../vendor/vendor.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: Config.JWT_SECRET,
        signOptions: {
          expiresIn: `${Config.JWT_EXPIRATION}s`,
        },
      }),
    }),
    UserModule,
    CustomerModule,
    VendorModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}
