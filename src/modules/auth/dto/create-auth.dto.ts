import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ default: 'johndoe@yopmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: '!Pass4sure' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  role: UserRole;
}
