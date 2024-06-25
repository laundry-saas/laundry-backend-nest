import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer/customer.service';
import { UserService } from '../user/user.service';
import { UserRole } from '@prisma/client';
import {
  CreateAuthVendorDto,
  CreateCustomerAuthDto,
} from './dto/create-auth.dto';
import { VendorService } from '../vendor/vendor.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly vendorService: VendorService,
  ) {}

  @Post('register/customer')
  async registerCustomer(@Body() createCustomerDto: CreateCustomerAuthDto) {
    const { email, phone, password, name, vendorId } = createCustomerDto;
    await this.userService.validateUserEmailExists(email);
    const createdUser = await this.userService.create({
      phone,
      email,
      password,
      role: UserRole.CUSTOMER,
    });
    await this.vendorService.findOneOrThrow(vendorId)
    await this.customerService.create({
      email,
      phone,
      name,
      userId: createdUser.id,
      vendorId,
    });
    const response = await this.authService.generateJwtToken(createdUser);
    //TODO: send out email
    return response;
  }

  @Post('register/vendor')
  async registerVendor(@Body() createVendorDto: CreateAuthVendorDto) {
    const {
      phone,
      email,
      password,
      name,
      businesEmail,
      businessPhone,
      country,
    } = createVendorDto;
    await this.userService.validateUserPhoneExists(phone);
    await this.userService.validateUserEmailExists(email);
    const createdUser = await this.userService.create({
      phone,
      email,
      password,
      role: UserRole.VENDOR,
    });
    await this.vendorService.create({
      country,
      contactInfo: { businesEmail, businessPhone },
      name,
      userId: createdUser.id,
    });
    const response = await this.authService.generateJwtToken(createdUser);
    //TODO: send out email
    return response;
  }

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
}
