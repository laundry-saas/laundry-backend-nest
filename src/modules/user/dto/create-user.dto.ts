import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'johndoe@yopmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: '+2348097893822' })
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  phone: string;

  @ApiProperty({ default: '!Pass4sure' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  role: UserRole;
}
