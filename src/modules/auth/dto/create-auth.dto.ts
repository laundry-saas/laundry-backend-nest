import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ default: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '+234808979990' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ default: '!Pass4sure' })
  @IsNotEmpty()
  password: string;
}

export class CreateCustomerAuthDto extends CreateAuthDto {
  @ApiProperty({ default: 'xxxxid' })
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty({ default: 'dev-customer@yopmail.com' })
  @IsOptional()
  email: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateAuthVendorDto extends CreateAuthDto {
  @ApiProperty({ enum: UserRole, default: UserRole.VENDOR })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ default: 'dev-vendor@yopmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: 'nigeria' })
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  businesEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  businessPhone: string;
}
