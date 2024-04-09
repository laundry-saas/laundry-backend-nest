import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import {  Type } from 'class-transformer'

export class VendorContactInfo {
  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  businessPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsNotEmpty()
  businesEmail: string;
}

export class CreateVendorDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => VendorContactInfo)
  contactInfo: VendorContactInfo;
}
